// const express = require("express");
// const router = express.Router();
// const VoiceResponse = require("twilio").twiml.VoiceResponse;

// const Lead = require("../models/lead/LeadModel");
// const CallLog = require("../models/lead/CallLogModel");

// router.post("/ivr", async (req, res) => {
//   const twiml = new VoiceResponse();

//   const gather = twiml.gather({
//     numDigits: 1,
//     action: "/api/ivr/handle-input",
//   });

//   gather.say("Welcome to CRM system. Press 1 for Sales, Press 2 for Support");

//   res.type("text/xml");
//   res.send(twiml.toString());
// });

// // Step 2: Handle Input
// router.post("/handle-input", async (req, res) => {
//   const twiml = new VoiceResponse();
//   const digit = req.body.Digits;
//   const phone = req.body.From;

//   let department = "Unknown";

//   if (digit === "1") {
//     department = "Sales";
//     twiml.say("Connecting to Sales team");
//   } else if (digit === "2") {
//     department = "Support";
//     twiml.say("Connecting to Support team");
//   } else {
//     twiml.say("Invalid input");
//   }

//   // Save Lead
//   await Lead.create({
//     phone,
//     assignedTo: department,
//   });

//   // Save Call Log
//   await CallLog.create({
//     phone,
//     digitPressed: digit,
//     department,
//   });

//   res.type("text/xml");
//   res.send(twiml.toString());
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const Lead = require("../models/lead/LeadModel");
const CallLog = require("../models/lead/CallLogModel");

// Step 1: IVR Welcome
router.post("/ivr", async (req, res) => {
  const twiml = new VoiceResponse();
  const callSid = req.body.CallSid;
  const phone = req.body.From;

  console.log("IVR Call started:", { callSid, phone });

  if (!phone) {
    console.error("No phone number in request");
    twiml.say("Sorry, we could not identify your number. Goodbye.");
    res.type("text/xml");
    res.send(twiml.toString());
    return;
  }

  // Create in-progress log immediately
  try {
    await CallLog.create({ phone, callSid, callStatus: "in-progress" });
    console.log("CallLog created for:", callSid);
  } catch (e) {
    console.error("Error creating CallLog:", e);
    /* ignore duplicate CallSid */
  }

  const gather = twiml.gather({
    numDigits: 1,
    action: "/api/ivr/handle-input",
    timeout: 5,
  });
  gather.say("Welcome to CRM system. Press 1 for Sales. Press 2 for Support.");
  twiml.say("We did not receive your input. Goodbye.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// Step 2: Handle Digit Input
router.post("/handle-input", async (req, res) => {
  const twiml = new VoiceResponse();
  const digit = req.body.Digits;
  const phone = req.body.From;
  const callSid = req.body.CallSid;

  console.log("IVR Handle input:", { callSid, phone, digit });

  if (!phone || !callSid) {
    console.error("Missing phone or callSid in handle-input");
    twiml.say("Sorry, there was an error. Goodbye.");
    res.type("text/xml");
    res.send(twiml.toString());
    return;
  }

  let department = "Unknown";
  if (digit === "1") {
    department = "Sales";
    twiml.say("Connecting you to the Sales team. Please hold.");
  } else if (digit === "2") {
    department = "Support";
    twiml.say("Connecting you to Support. Please hold.");
  } else {
    twiml.say("Invalid input. Goodbye.");
  }

  // Enable recording for the call
  twiml.record({
    action: "/api/ivr/recording-callback",
    method: "POST",
    maxLength: 3600, // 1 hour max
    playBeep: false,
  });

  // Upsert lead (don't duplicate)
  let lead;
  try {
    lead = await Lead.findOneAndUpdate(
      { phone: phone.replace(/\D/g, "").replace(/^91/, "") },
      {
        $setOnInsert: {
          name: "IVR Lead",
          phone: phone.replace(/\D/g, "").replace(/^91/, ""),
          source: "IVR",
          assignedTo: department,
          status: "New",
          leadTag: "Warm",
        },
      },
      { upsert: true, new: true },
    );
    console.log("Lead upserted:", lead?._id);
  } catch (e) {
    console.error("Error upserting lead:", e);
    /* ignore */
  }

  // Update call log
  try {
    await CallLog.findOneAndUpdate(
      { callSid },
      {
        digitPressed: digit,
        department,
        leadId: lead?._id,
        updatedAt: new Date(),
      },
    );
    console.log("CallLog updated for:", callSid);
  } catch (e) {
    console.error("Error updating CallLog:", e);
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// Step 3: Twilio calls this when call ends
router.post("/status-callback", async (req, res) => {
  const { CallSid, CallStatus, CallDuration, From, RecordingUrl } = req.body;

  console.log("IVR Status callback:", {
    CallSid,
    CallStatus,
    CallDuration,
    RecordingUrl,
  });

  const statusMap = {
    completed: "completed",
    "no-answer": "missed",
    busy: "missed",
    failed: "failed",
    canceled: "missed",
  };

  try {
    await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      {
        callStatus: statusMap[CallStatus] || CallStatus,
        duration: Number(CallDuration) || 0,
        recordingUrl: RecordingUrl || undefined,
        updatedAt: new Date(),
      },
    );
    console.log("CallLog status updated for:", CallSid);
  } catch (e) {
    console.error("Error updating CallLog status:", e);
  }

  res.sendStatus(200);
});

// Recording Callback
router.post("/recording-callback", async (req, res) => {
  const { CallSid, RecordingUrl } = req.body;

  if (RecordingUrl) {
    await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      { recordingUrl: RecordingUrl, updatedAt: new Date() },
    ).catch(() => {});
  }

  res.sendStatus(200);
});

// ====================== GET: All Call Logs ======================
router.get("/calls", async (req, res) => {
  try {
    const { page = 1, limit = 50, department, status, search } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (status) filter.callStatus = status;
    if (search) filter.phone = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      CallLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("leadId", "name status leadTag")
        .lean(),
      CallLog.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// ====================== GET: Stats Summary ======================
router.get("/stats", async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, sales, support, missed, leads] = await Promise.all([
      CallLog.countDocuments(),
      CallLog.countDocuments({ department: "Sales" }),
      CallLog.countDocuments({ department: "Support" }),
      CallLog.countDocuments({
        callStatus: "missed",
        createdAt: { $gte: todayStart },
      }),
      Lead.countDocuments({ source: "IVR" }),
    ]);

    return res.json({ success: true, total, sales, support, missed, leads });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
