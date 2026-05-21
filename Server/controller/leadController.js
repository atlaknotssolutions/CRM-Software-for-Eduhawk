const XLSX = require("xlsx");
const mongoose = require("mongoose");
const Lead = require("../models/lead/LeadModel");
const Employee = require("../models/Employee");
const transporter = require("../Email/nodemailer.js");

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Email send failed:", error);
  }
};

const formatDateTime = (iso) => {
  if (!iso) return "Not set";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeKey = (key) => {
  if (!key) return "";
  const k = String(key).trim().toLowerCase();

  if (
    k.includes("name") &&
    !k.includes("parent") &&
    !k.includes("father") &&
    !k.includes("mother")
  ) {
    return "name";
  }
  if (
    k.includes("phone") ||
    k.includes("mobile") ||
    k.includes("number") ||
    k.includes("contact")
  ) {
    return "phone";
  }
  if (k.includes("parent") || k.includes("father") || k.includes("mother")) {
    return "parentName";
  }
  if (k.includes("city") || k.includes("location") || k.includes("district")) {
    return "city";
  }
  if (k.includes("email")) return "email";
  if (k.includes("neet")) return "neetStatus";
  if (k.includes("budget")) return "budget";
  if (k.includes("country") || k.includes("prefer")) return "preferredCountry";
  if (k.includes("college")) return "collegeName";
  if (k.includes("emergency")) return "emergencyContact";
  if (k.includes("service") && k.includes("manager")) return "serviceManager";

  return k.replace(/\s+/g, "");
};

const cleanString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseWorkbook = (buffer, extension) => {
  const workbook =
    extension === "csv"
      ? XLSX.read(buffer.toString("utf8"), { type: "string" })
      : XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
};

const getBalancedCounsellor = async () => {
  const counsellors = await Employee.find({
    role: "Counsellor",
    status: "active",
  }).select("_id name email");

  if (counsellors.length === 0) return null;

  const counts = await Lead.aggregate([
    {
      $match: {
        status: "Converted",
        assignedToCounsellor: { $in: counsellors.map((c) => c._id) },
      },
    },
    {
      $group: {
        _id: "$assignedToCounsellor",
        count: { $sum: 1 },
      },
    },
  ]);

  const countMap = counts.reduce((map, item) => {
    map.set(String(item._id), item.count);
    return map;
  }, new Map());

  let chosen = counsellors[0];
  let minCount = Infinity;

  counsellors.forEach((counsellor) => {
    const assignedCount = countMap.get(String(counsellor._id)) || 0;
    if (assignedCount < minCount) {
      chosen = counsellor;
      minCount = assignedCount;
    }
  });

  return chosen;
};

// ====================== Bulk Upload Leads ======================
// ====================== Bulk Upload Leads ======================
// exports.bulkUploadLeads = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No file uploaded." });
//     }

//     const extension = req.file.originalname.split(".").pop().toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Only CSV/Excel files allowed." });
//     }

//     const rows = parseWorkbook(req.file.buffer, extension);

//     if (!rows || rows.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "File is empty." });
//     }

//     // ====================== Get All Active Telecallers ======================
//     const telecallers = await Employee.find({
//       role: "Telecaller",
//       status: "active",
//     }).select("_id name email");

//     if (telecallers.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No active telecallers found. Please add telecallers first.",
//       });
//     }

//     // ====================== Prepare Leads ======================
//     const normalizedLeads = rows
//       .map((row) => {
//         const normalized = {};
//         Object.keys(row).forEach((key) => {
//           const nk = normalizeKey(key);
//           normalized[nk] = row[key];
//         });

//         const rawPhone = cleanString(normalized.phone || "");
//         let cleanedPhone = rawPhone.replace(/\D/g, "");

//         if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
//           cleanedPhone = cleanedPhone.slice(2);
//         }

//         const budgetRaw = normalized.budget;
//         const budgetNumber = budgetRaw
//           ? Number(String(budgetRaw).replace(/,/g, "").trim())
//           : undefined;

//         return {
//           name: cleanString(normalized.name),
//           phone: cleanedPhone,
//           parentName: cleanString(normalized.parentName || ""),
//           city: cleanString(normalized.city || ""),
//           email: cleanString(normalized.email || ""),
//           neetStatus: cleanString(normalized.neetStatus || ""),
//           budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
//           preferredCountry: cleanString(normalized.preferredCountry || ""),
//           collegeName: cleanString(normalized.collegeName || ""),
//           emergencyContact: cleanString(normalized.emergencyContact || ""),
//           serviceManager: cleanString(normalized.serviceManager || ""),
//           status: "New",
//           leadTag: "Warm",
//           // assignedToTelecaller will be added later
//         };
//       })
//       .filter((lead) => lead.name && lead.phone && lead.phone.length >= 10);

//     if (normalizedLeads.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid leads found (Name + 10 digit Phone required).",
//       });
//     }

//     const filePhoneSet = new Set();
//     const uniqueFileLeads = [];
//     let duplicateFileRows = 0;

//     normalizedLeads.forEach((lead) => {
//       if (filePhoneSet.has(lead.phone)) {
//         duplicateFileRows += 1;
//         return;
//       }
//       filePhoneSet.add(lead.phone);
//       uniqueFileLeads.push(lead);
//     });

//     const existingLeads = await Lead.find(
//       { phone: { $in: Array.from(filePhoneSet) } },
//       "phone",
//     ).lean();
//     const existingPhoneSet = new Set(existingLeads.map((lead) => lead.phone));

//     const leadsToInsert = uniqueFileLeads.filter(
//       (lead) => !existingPhoneSet.has(lead.phone),
//     );
//     const duplicateExistingRows = uniqueFileLeads.length - leadsToInsert.length;

//     if (leadsToInsert.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "All leads are duplicates of existing records or duplicate rows in the file.",
//       });
//     }

//     // ====================== Distribute Leads Equally (Round Robin) ======================
//     const totalLeads = leadsToInsert.length;
//     const totalTelecallers = telecallers.length;

//     console.log(
//       `Distributing ${totalLeads} leads among ${totalTelecallers} telecallers`,
//     );

//     const telecallerDistribution = telecallers.map((telecaller) => ({
//       _id: telecaller._id,
//       name: telecaller.name,
//       email: telecaller.email,
//       count: 0,
//     }));

//     leadsToInsert.forEach((lead, index) => {
//       const telecallerIndex = index % totalTelecallers; // Round Robin
//       lead.assignedToTelecaller = telecallers[telecallerIndex]._id;
//       telecallerDistribution[telecallerIndex].count += 1;
//     });

//     // ====================== Insert into Database ======================
//     let inserted = [];
//     try {
//       inserted = await Lead.insertMany(leadsToInsert, { ordered: false });
//     } catch (bulkError) {
//       if (bulkError.insertedDocs) {
//         inserted = bulkError.insertedDocs;
//       } else if (bulkError.result?.insertedCount !== undefined) {
//         inserted = { length: bulkError.result.insertedCount };
//       }
//     }

//     const importedCount = inserted.length || 0;
//     const leadIds = Array.isArray(inserted)
//       ? inserted.map((lead) => lead._id || lead)
//       : [];

//     return res.status(201).json({
//       success: true,
//       message: `Successfully imported ${importedCount} leads!`,
//       totalRows: rows.length,
//       validLeads: leadsToInsert.length,
//       imported: importedCount,
//       duplicateFileRows,
//       duplicateExistingRows,
//       skipped: rows.length - importedCount,
//       leadIds,
//       distributedTo: totalTelecallers + " telecallers",
//       telecallerDistribution: telecallerDistribution.map((t) => ({
//         telecallerId: t._id,
//         name: t.name,
//         assignedLeads: t.count,
//       })),
//       note: `Leads distributed equally using Round-Robin method while skipping duplicate phone entries.`,
//     });
//   } catch (error) {
//     console.error("Bulk Upload Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during bulk upload.",
//       error: error.message,
//     });
//   }
// };

// ====================== Add Single Lead ======================
exports.addLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      parentName,
      city,
      email,
      neetStatus,
      budget,
      preferredCountry,
      collegeName,
      emergencyContact,
      status,
      leadTag,
    } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Phone are required." });
    }

    let cleanedPhone = String(phone).replace(/\D/g, "");
    if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
      cleanedPhone = cleanedPhone.slice(2);
    }

    if (cleanedPhone.length < 10) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number." });
    }

    const lead = await Lead.create({
      name: String(name).trim(),
      phone: cleanedPhone,
      parentName,
      city,
      email,
      neetStatus,
      budget: budget ? Number(String(budget).replace(/,/g, "")) : undefined,
      preferredCountry,
      collegeName,
      emergencyContact,
      status: status || "New",
      leadTag: leadTag || "Warm",
    });

    return res
      .status(201)
      .json({ success: true, message: "Lead added successfully.", data: lead });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Phone number already exists." });
    }
    return res.status(500).json({
      success: false,
      message: "Error adding lead.",
      error: error.message,
    });
  }
};

// controllers/leadController.js
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id)
      .populate("assignedToTelecaller", "name email")
      .populate("assignedToCounsellor", "name email");

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    console.error("Get Lead By ID Error:", error);
    if (error.name === "CastError" || error.kind === "ObjectId") {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// exports.getLeadById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const lead = await Lead.findById(id)
//       .populate("assignedToTelecaller", "name email")
//       .populate("assignedToCounsellor", "name email");

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: lead,
//     });
//   } catch (error) {
//     console.error("Get Lead By ID Error:", error);
//     if (error.name === "CastError") {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found",
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: "Error fetching lead",
//     });
//   }
// };

exports.getCounsellorLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", leadTag, city } = req.query;

    const filter = {};

    // ✅ Sirf Converted leads
    filter.status = "Converted";

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (leadTag) filter.leadTag = leadTag;
    if (city) filter.city = { $regex: city, $options: "i" };

    if (req.user?.role === "Counsellor") {
      filter.assignedToCounsellor = req.user._id;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedToCounsellor", "name email")
        .populate("assignedToTelecaller", "name email")
        .lean(),

      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: leads,
    });
  } catch (error) {
    console.error("Get Counsellor Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leads.",
      error: error.message,
    });
  }
};

// ====================== Get Attendance by Name ======================

exports.getTelecallerLeads = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "", leadTag, city } = req.query;

    // Ensure only authenticated telecaller can access
    if (!req.user || req.user.role !== "Telecaller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only telecallers can view their leads.",
      });
    }

    const filter = {
      assignedToTelecaller: req.user._id, // ← MOST IMPORTANT CHANGE
    };

    // Optional: Show only non-converted OR converted leads that are still visible
    // You can remove this if you want to hide converted leads completely
    filter.$or = [
      { status: { $ne: "Converted" } },
      { status: "Converted", isVisibleToTelecaller: true },
    ];

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (leadTag) filter.leadTag = leadTag;
    if (city) filter.city = { $regex: city, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const [leads, total, todayConverted] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedToTelecaller", "name email")
        .populate("assignedToCounsellor", "name email") // optional
        .lean(),

      Lead.countDocuments(filter),

      Lead.countDocuments({
        assignedToTelecaller: req.user._id,
        status: "Converted",
        updatedAt: { $gte: todayStart, $lt: todayEnd },
      }),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      todayConverted,
      data: leads,
    });
  } catch (error) {
    console.error("Get Telecaller Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leads.",
      error: error.message,
    });
  }
};
// exports.getTelecallerLeads = async (req, res) => {
//   try {
//     const { page = 1, limit = 50, search = "", leadTag, city } = req.query;

//     const filter = {};

//     // Show non-converted leads OR converted leads that are still visible to telecaller
//     filter.$or = [
//       { status: { $ne: "Converted" } },
//       { status: "Converted", isVisibleToTelecaller: true },
//     ];

//     // Search
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (leadTag) filter.leadTag = leadTag;
//     if (city) filter.city = { $regex: city, $options: "i" };

//     const skip = (Number(page) - 1) * Number(limit);
//     const todayStart = new Date();
//     todayStart.setHours(0, 0, 0, 0);
//     const todayEnd = new Date(todayStart);
//     todayEnd.setDate(todayEnd.getDate() + 1);

//     const [leads, total, todayConverted] = await Promise.all([
//       Lead.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .populate("assignedToTelecaller", "name email")
//         .lean(),

//       Lead.countDocuments(filter),
//       Lead.countDocuments({
//         status: "Converted",
//         updatedAt: { $gte: todayStart, $lt: todayEnd },
//       }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//       todayConverted,
//       data: leads,
//     });
//   } catch (error) {
//     console.error("Get Telecaller Leads Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching leads.",
//       error: error.message,
//     });
//   }
// };

exports.getAllLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      status,
      leadTag,
      city,
    } = req.query;

    const filter = {};

    // Search by name, phone or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (leadTag) filter.leadTag = leadTag;
    if (city) filter.city = { $regex: city, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("assignedToTelecaller", "name email")
        .populate("assignedToCounsellor", "name email")
        .lean(), // Important: Returns plain JavaScript objects with full data

      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: leads,
    });
  } catch (error) {
    console.error("Get All Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching leads.",
      error: error.message,
    });
  }
};

// exports.getAllLeads = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       status,
//       leadTag,
//       city,
//     } = req.query;

//     const filter = {};

//     // Search by name or phone
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (status) filter.status = status;
//     if (leadTag) filter.leadTag = leadTag;
//     if (city) filter.city = { $regex: city, $options: "i" };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [leads, total] = await Promise.all([
//       Lead.find(filter)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .populate("assignedToTelecaller", "name email")
//         .populate("assignedToCounsellor", "name email"),
//       Lead.countDocuments(filter),
//     ]);

//     return res.status(200).json({
//       success: true,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / Number(limit)),
//       data: leads,
//     });
//   } catch (error) {
//     console.error("Get All Leads Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching leads.",
//       error: error.message,
//     });
//   }
// };

// ====================== Update Lead ======================
exports.updateLead = async (req, res) => {
  try {
    const existingLead = await Lead.findById(req.params.id)
      .populate("assignedToTelecaller", "name email")
      .populate("assignedToCounsellor", "name email");

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    const allowedFields = [
      "name",
      "phone",
      "parentName",
      "city",
      "email",
      "neetStatus",
      "budget",
      "preferredCountry",
      "collegeName",
      "emergencyContact",
      "serviceManager",
      "status",
      "leadTag",
      "followUpDate",
      "lastFollowUp",
      "lastRemark",
      "counsellorRemark",
      "registrationFeePaid",
      "documentsSubmitted",
      "documentFileReady",
      "collegeApplicationDone",
      "admissionLetterIssued",
      "visaApplied",
      "visaIssued",
      "ticketBooked",
      "departureDate",
      "departureStatus",
      "assignedToTelecaller",
      "assignedToCounsellor",
      "isVisibleToTelecaller",
      "progress",
    ];

    const role = req.user?.role || "";
    const isCounsellorLead = String(existingLead.status) === "Converted";
    const isTelecallerLead =
      String(existingLead.status || "").toLowerCase() !== "converted";

    if (isTelecallerLead && role !== "Telecaller") {
      return res.status(403).json({
        success: false,
        message: "Only Telecaller can update telecaller leads.",
      });
    }

    if (isCounsellorLead && role !== "Counsellor" && role !== "Admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only counsellors and admins can update converted counsellor leads.",
      });
    }

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const counsellorOnlyFields = [
      "counsellorRemark",
      "registrationFeePaid",
      "documentsSubmitted",
      "documentFileReady",
      "collegeApplicationDone",
      "admissionLetterIssued",
      "visaApplied",
      "visaIssued",
      "ticketBooked",
      "collegeName",
      "emergencyContact",
      "serviceManager",
    ];
    const adminOnlyFields = ["assignedToTelecaller", "assignedToCounsellor"];
    const telecallerAllowedFields = [
      "lastRemark",
      "followUpDate",
      "status",
      "leadTag",
    ];

    if (role === "Telecaller") {
      const invalidFields = Object.keys(updateData).filter(
        (field) => !telecallerAllowedFields.includes(field),
      );
      if (invalidFields.length > 0) {
        return res.status(403).json({
          success: false,
          message: `Telecaller cannot update fields: ${invalidFields.join(", ")}`,
        });
      }
    }

    if (role === "Counsellor") {
      const invalidFields = Object.keys(updateData).filter((field) =>
        adminOnlyFields.includes(field),
      );
      if (invalidFields.length > 0) {
        return res.status(403).json({
          success: false,
          message: `Counsellor cannot update assignment fields: ${invalidFields.join(", ")}`,
        });
      }
    }

    if (role !== "Admin" && role !== "Counsellor" && role !== "Telecaller") {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions to update lead.",
      });
    }

    const isConvertedLead =
      String(req.body.status || existingLead.status) === "Converted";
    const hasCounsellorOverride =
      req.body.assignedToCounsellor !== undefined &&
      req.body.assignedToCounsellor !== null &&
      String(req.body.assignedToCounsellor).trim() !== "";

    const shouldAutoAssignCounsellor =
      isConvertedLead &&
      !existingLead.assignedToCounsellor &&
      !hasCounsellorOverride;

    if (shouldAutoAssignCounsellor) {
      const balancedCounsellor = await getBalancedCounsellor();
      if (balancedCounsellor) {
        updateData.assignedToCounsellor = balancedCounsellor._id;
      }
    }

    // Set visibility for telecaller when converted
    if (isConvertedLead) {
      updateData.isVisibleToTelecaller = true;
    }

    // If counsellor updates progress to "Completed", hide from telecaller
    if (role === "Counsellor" && req.body.progress === "Completed") {
      updateData.isVisibleToTelecaller = false;
    }

    if (req.user?._id) {
      updateData.lastUpdatedBy = req.user._id;
    }

    if (role === "Telecaller") {
      // Telecaller may only update leads assigned to them
      const assignedTelecallerId = existingLead.assignedToTelecaller
        ? String(
            existingLead.assignedToTelecaller._id ||
              existingLead.assignedToTelecaller,
          )
        : null;

      if (
        !assignedTelecallerId ||
        assignedTelecallerId !== String(req.user._id)
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update leads assigned to you.",
        });
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("assignedToTelecaller", "name email")
      .populate("assignedToCounsellor", "name email");

    return res.status(200).json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating lead.",
      error: error.message,
    });
  }
};

// ====================== Bulk Upload Leads WITHOUT Assignment ======================
// exports.bulkUploadLeadsWithoutAssignment = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded.",
//       });
//     }

//     const extension = req.file.originalname.split(".").pop().toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res.status(400).json({
//         success: false,
//         message: "Only CSV and Excel files are allowed.",
//       });
//     }

//     const rows = parseWorkbook(req.file.buffer, extension);

//     if (!rows || rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "File is empty.",
//       });
//     }

//     const forceImport = req.body?.forceImport === "true" || req.query?.forceImport === "true";

//     // ====================== Normalize Leads ======================
//     const normalizedLeads = rows.map((row) => {
//       const normalized = {};
//       Object.keys(row).forEach((key) => {
//         const nk = normalizeKey(key);
//         normalized[nk] = row[key];
//       });

//       const rawPhone = cleanString(normalized.phone || "");
//       let cleanedPhone = rawPhone.replace(/\D/g, "");

//       // Remove country code 91 if present
//       if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
//         cleanedPhone = cleanedPhone.slice(2);
//       }

//       const budgetRaw = normalized.budget;
//       const budgetNumber = budgetRaw
//         ? Number(String(budgetRaw).replace(/,/g, "").trim())
//         : undefined;

//       return {
//         name: cleanString(normalized.name),
//         phone: cleanedPhone,
//         parentName: cleanString(normalized.parentName || ""),
//         city: cleanString(normalized.city || ""),
//         email: cleanString(normalized.email || ""),
//         neetStatus: cleanString(normalized.neetStatus || ""),
//         budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
//         preferredCountry: cleanString(normalized.preferredCountry || ""),
//         collegeName: cleanString(normalized.collegeName || ""),
//         emergencyContact: cleanString(normalized.emergencyContact || ""),
//         serviceManager: cleanString(normalized.serviceManager || ""),

//         // No automatic assignment
//         status: "New",
//         leadTag: "Warm",
//         assignedToTelecaller: null,
//         assignedAt: null,

//         createdBy: req.user?._id,
//         lastUpdatedBy: req.user?._id,
//         updatedAt: new Date(),
//       };
//     });

//     let finalLeadsToInsert = [];
//     let duplicateFileRowsCount = 0;
//     let duplicateExistingRowsCount = 0;
//     let validatedCount = 0;

//     if (!forceImport) {
//       // Normal Import with Validation
//       const validatedLeads = normalizedLeads.filter(
//         (lead) => lead.name && lead.phone && lead.phone.length >= 10
//       );

//       validatedCount = validatedLeads.length;

//       if (validatedCount === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "No valid leads found. Name + 10 digit Phone is required.",
//         });
//       }

//       // Remove duplicate phones in the same file
//       const filePhoneSet = new Set();
//       const uniqueFileLeads = [];

//       validatedLeads.forEach((lead) => {
//         if (filePhoneSet.has(lead.phone)) {
//           duplicateFileRowsCount++;
//           return;
//         }
//         filePhoneSet.add(lead.phone);
//         uniqueFileLeads.push(lead);
//       });

//       // Check existing leads in DB
//       const existingLeads = await Lead.find(
//         { phone: { $in: Array.from(filePhoneSet) } },
//         "phone"
//       ).lean();

//       const existingPhoneSet = new Set(existingLeads.map((l) => l.phone));

//       finalLeadsToInsert = uniqueFileLeads.filter(
//         (lead) => !existingPhoneSet.has(lead.phone)
//       );

//       duplicateExistingRowsCount = uniqueFileLeads.length - finalLeadsToInsert.length;
//     } else {
//       // Force Import
//       finalLeadsToInsert = normalizedLeads;
//       validatedCount = normalizedLeads.length;
//     }

//     if (finalLeadsToInsert.length === 0 && !forceImport) {
//       return res.status(400).json({
//         success: false,
//         message: "All leads are either duplicates or invalid.",
//       });
//     }

//     // ====================== Insert into Database ======================
//     let inserted = [];
//     try {
//       inserted = await Lead.insertMany(finalLeadsToInsert, { ordered: false });
//     } catch (bulkError) {
//       console.error("Bulk insert error:", bulkError);
//       if (bulkError.insertedDocs) {
//         inserted = bulkError.insertedDocs;
//       } else if (bulkError.result?.insertedCount !== undefined) {
//         inserted = Array.from({ length: bulkError.result.insertedCount });
//       }
//     }

//     const importedCount = Array.isArray(inserted) ? inserted.length : 0;
//     const leadIds = Array.isArray(inserted)
//       ? inserted.map((lead) => lead?._id?.toString()).filter(Boolean)
//       : [];

//     return res.status(201).json({
//       success: true,
//       message: `Successfully imported ${importedCount} leads without assignment.`,
//       totalRows: rows.length,
//       validLeads: validatedCount,
//       imported: importedCount,
//       leadIds,                    // ← Fixed: Properly extracted
//       duplicateFileRows: duplicateFileRowsCount,
//       duplicateExistingRows: duplicateExistingRowsCount,
//       skipped: rows.length - importedCount,
//       note: "Leads are ready for manual assignment.",
//     });
//   } catch (error) {
//     console.error("Bulk Upload Without Assignment Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during bulk upload.",
//       error: error.message,
//     });
//   }
// };
// ====================== Bulk Upload Leads WITHOUT Auto Assignment ======================
// exports.bulkUploadLeadsWithoutAssignment = async (req, res) => {
//   try {
//     if (!req.file || !req.file.buffer) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded.",
//       });
//     }

//     const extension = req.file.originalname.split(".").pop().toLowerCase();

//     if (!["csv", "xlsx", "xls"].includes(extension)) {
//       return res.status(400).json({
//         success: false,
//         message: "Only CSV and Excel files are allowed.",
//       });
//     }

//     const rows = parseWorkbook(req.file.buffer, extension);

//     if (!rows || rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "File is empty.",
//       });
//     }

//     const forceImport =
//       req.body?.forceImport === "true" || req.query?.forceImport === "true";

//     // ====================== Normalize Leads ======================
//     const normalizedLeads = rows.map((row) => {
//       const normalized = {};
//       Object.keys(row).forEach((key) => {
//         const nk = normalizeKey(key);
//         normalized[nk] = row[key];
//       });

//       const rawPhone = cleanString(normalized.phone || "");
//       let cleanedPhone = rawPhone.replace(/\D/g, "");

//       if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
//         cleanedPhone = cleanedPhone.slice(2);
//       }

//       const budgetRaw = normalized.budget;
//       const budgetNumber = budgetRaw
//         ? Number(String(budgetRaw).replace(/,/g, "").trim())
//         : undefined;

//       return {
//         name: cleanString(normalized.name),
//         phone: cleanedPhone,
//         parentName: cleanString(normalized.parentName || ""),
//         city: cleanString(normalized.city || ""),
//         email: cleanString(normalized.email || ""),
//         neetStatus: cleanString(normalized.neetStatus || ""),
//         budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
//         preferredCountry: cleanString(normalized.preferredCountry || ""),
//         collegeName: cleanString(normalized.collegeName || ""),
//         emergencyContact: cleanString(normalized.emergencyContact || ""),
//         serviceManager: cleanString(normalized.serviceManager || ""),

//         // === NO AUTO ASSIGNMENT ===
//         status: "New",
//         leadTag: "Warm",
//         assignedToTelecaller: null,
//         assignedAt: null,

//         createdBy: req.user?._id,
//         lastUpdatedBy: req.user?._id,
//         updatedAt: new Date(),
//       };
//     });

//     let finalLeadsToInsert = [];
//     let duplicateFileRowsCount = 0;
//     let duplicateExistingRowsCount = 0;
//     let validatedCount = 0;

//     if (!forceImport) {
//       const validatedLeads = normalizedLeads.filter(
//         (lead) => lead.name?.trim() && lead.phone?.length >= 10
//       );

//       validatedCount = validatedLeads.length;

//       if (validatedCount === 0) {
//         return res.status(400).json({
//           success: false,
//           message: "No valid leads found. Name + 10 digit Phone is required.",
//         });
//       }

//       // Remove duplicates in file
//       const filePhoneSet = new Set();
//       const uniqueFileLeads = [];

//       validatedLeads.forEach((lead) => {
//         if (filePhoneSet.has(lead.phone)) {
//           duplicateFileRowsCount++;
//           return;
//         }
//         filePhoneSet.add(lead.phone);
//         uniqueFileLeads.push(lead);
//       });

//       // Check existing in DB
//       const existingLeads = await Lead.find(
//         { phone: { $in: Array.from(filePhoneSet) } },
//         "phone"
//       ).lean();

//       const existingPhoneSet = new Set(existingLeads.map((l) => l.phone));

//       finalLeadsToInsert = uniqueFileLeads.filter(
//         (lead) => !existingPhoneSet.has(lead.phone)
//       );

//       duplicateExistingRowsCount =
//         uniqueFileLeads.length - finalLeadsToInsert.length;
//     } else {
//       finalLeadsToInsert = normalizedLeads;
//       validatedCount = normalizedLeads.length;
//     }

//     if (finalLeadsToInsert.length === 0 && !forceImport) {
//       return res.status(400).json({
//         success: false,
//         message: "All leads are duplicates or invalid.",
//       });
//     }

//     // ====================== Insert ======================
//     let inserted = [];
//     try {
//       inserted = await Lead.insertMany(finalLeadsToInsert, { ordered: false });
//     } catch (bulkError) {
//       console.error("Bulk insert error:", bulkError);
//       if (bulkError.insertedDocs) inserted = bulkError.insertedDocs;
//     }

//     const importedCount = Array.isArray(inserted) ? inserted.length : 0;
//     const leadIds = Array.isArray(inserted)
//       ? inserted.map((lead) => lead?._id?.toString()).filter(Boolean)
//       : [];

//     return res.status(201).json({
//       success: true,
//       message: `Successfully imported ${importedCount} leads without auto assignment.`,
//       totalRows: rows.length,
//       validLeads: validatedCount,
//       imported: importedCount,
//       leadIds,
//       duplicateFileRows: duplicateFileRowsCount,
//       duplicateExistingRows: duplicateExistingRowsCount,
//       skipped: rows.length - importedCount,
//       note: "Leads uploaded successfully. Use Manual Assignment to assign Telecallers.",
//     });
//   } catch (error) {
//     console.error("Bulk Upload Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error during bulk upload.",
//       error: error.message,
//     });
//   }
// };

// ====================== Bulk Upload Leads WITHOUT Auto Assignment ======================
exports.bulkUploadLeadsWithoutAssignment = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const extension = req.file.originalname.split(".").pop().toLowerCase();

    if (!["csv", "xlsx", "xls"].includes(extension)) {
      return res.status(400).json({
        success: false,
        message: "Only CSV and Excel files are allowed.",
      });
    }

    const rows = parseWorkbook(req.file.buffer, extension);

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "File is empty.",
      });
    }

    // ====================== Normalize Leads ======================
    const normalizedLeads = rows.map((row) => {
      const normalized = {};
      Object.keys(row).forEach((key) => {
        const nk = normalizeKey(key);
        normalized[nk] = row[key];
      });

      const rawPhone = cleanString(normalized.phone || "");
      let cleanedPhone = rawPhone.replace(/\D/g, "");

      if (cleanedPhone.startsWith("91") && cleanedPhone.length > 10) {
        cleanedPhone = cleanedPhone.slice(2);
      }

      const budgetRaw = normalized.budget;
      const budgetNumber = budgetRaw
        ? Number(String(budgetRaw).replace(/,/g, "").trim())
        : undefined;

      return {
        name: cleanString(normalized.name),
        phone: cleanedPhone,
        parentName: cleanString(normalized.parentName || ""),
        city: cleanString(normalized.city || ""),
        email: cleanString(normalized.email || ""),
        neetStatus: cleanString(normalized.neetStatus || ""),
        budget: Number.isFinite(budgetNumber) ? budgetNumber : undefined,
        preferredCountry: cleanString(normalized.preferredCountry || ""),
        collegeName: cleanString(normalized.collegeName || ""),
        emergencyContact: cleanString(normalized.emergencyContact || ""),
        serviceManager: cleanString(normalized.serviceManager || ""),

        // === IMPORTANT: NO AUTO ASSIGNMENT ===
        status: "New",
        leadTag: "Warm",
        assignedToTelecaller: null,
        assignedAt: null,

        createdBy: req.user?._id,
        lastUpdatedBy: req.user?._id,
        updatedAt: new Date(),
      };
    });

    // ====================== Validation & Duplicate Check ======================
    const validatedLeads = normalizedLeads.filter(
      (lead) => lead.name?.trim() && lead.phone?.length >= 10,
    );

    if (validatedLeads.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid leads found. Name + 10 digit Phone is required.",
      });
    }

    // Remove duplicates within the file
    const filePhoneSet = new Set();
    const uniqueFileLeads = [];
    let duplicateFileRowsCount = 0;

    validatedLeads.forEach((lead) => {
      if (filePhoneSet.has(lead.phone)) {
        duplicateFileRowsCount++;
        return;
      }
      filePhoneSet.add(lead.phone);
      uniqueFileLeads.push(lead);
    });

    // Check existing leads in DB
    const existingLeads = await Lead.find(
      { phone: { $in: Array.from(filePhoneSet) } },
      "phone",
    ).lean();

    const existingPhoneSet = new Set(existingLeads.map((l) => l.phone));

    const finalLeadsToInsert = uniqueFileLeads.filter(
      (lead) => !existingPhoneSet.has(lead.phone),
    );

    const duplicateExistingRowsCount =
      uniqueFileLeads.length - finalLeadsToInsert.length;

    if (finalLeadsToInsert.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All leads are duplicates or invalid.",
      });
    }

    // ====================== Insert into Database ======================
    let inserted = [];
    try {
      inserted = await Lead.insertMany(finalLeadsToInsert, { ordered: false });
    } catch (bulkError) {
      console.error("Bulk insert error:", bulkError);
      if (bulkError.insertedDocs) inserted = bulkError.insertedDocs;
    }

    const importedCount = Array.isArray(inserted) ? inserted.length : 0;
    const leadIds = Array.isArray(inserted)
      ? inserted.map((lead) => lead?._id?.toString()).filter(Boolean)
      : [];

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${importedCount} leads (Unassigned).`,
      totalRows: rows.length,
      validLeads: validatedLeads.length,
      imported: importedCount,
      leadIds,
      duplicateFileRows: duplicateFileRowsCount,
      duplicateExistingRows: duplicateExistingRowsCount,
      skipped: rows.length - importedCount,
      note: "Leads are ready for manual assignment to telecallers.",
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during bulk upload.",
      error: error.message,
    });
  }
};
// ====================== Manual Lead Assignment ======================
exports.assignLeadsManually = async (req, res) => {
  try {
    let { leadIds = [], telecallerIds = [] } = req.body;
    console.log("Received for manual assignment - Lead IDs:", leadIds);
    console.log(
      "Received for manual assignment - Telecaller IDs:",
      telecallerIds,
    );

    if (!Array.isArray(leadIds)) leadIds = [];
    if (!Array.isArray(telecallerIds)) telecallerIds = [];

    if (leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No leads provided for assignment.",
      });
    }

    if (telecallerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one telecaller.",
      });
    }

    // Get only active telecallers
    const telecallers = await Employee.find({
      _id: { $in: telecallerIds },
      role: "Telecaller",
      status: "active",
    }).select("_id name email");

    if (telecallers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active telecallers found in your selection.",
      });
    }

    // Optional: Check already assigned leads
    const alreadyAssigned = await Lead.find({
      _id: { $in: leadIds },
      assignedToTelecaller: { $ne: null },
    }).select("_id");

    if (alreadyAssigned.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${alreadyAssigned.length} leads are already assigned.`,
      });
    }

    // ====================== Round-Robin Assignment ======================
    const totalLeads = leadIds.length;
    const totalTelecallers = telecallers.length;

    const bulkOps = [];
    const distribution = telecallers.map((t) => ({
      telecallerId: t._id,
      name: t.name,
      assignedLeads: 0,
    }));

    leadIds.forEach((leadId, index) => {
      const telecallerIndex = index % totalTelecallers;
      const telecallerId = telecallers[telecallerIndex]._id;

      bulkOps.push({
        updateOne: {
          filter: { _id: leadId },
          update: {
            $set: {
              assignedToTelecaller: telecallerId,
              assignedAt: new Date(),
              lastUpdatedBy: req.user?._id,
              updatedAt: new Date(),
            },
          },
        },
      });

      distribution[telecallerIndex].assignedLeads += 1;
    });

    if (bulkOps.length > 0) {
      await Lead.bulkWrite(bulkOps, { ordered: false });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully assigned ${totalLeads} leads to ${totalTelecallers} telecaller${totalTelecallers > 1 ? "s" : ""}.`,
      assigned: totalLeads,
      telecallerCount: totalTelecallers,
      distribution,
    });
  } catch (error) {
    console.error("Manual Assignment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while assigning leads.",
      error: error.message,
    });
  }
};
// exports.assignLeadsManually = async (req, res) => {
//   try {
//     let { leadIds = [], telecallerIds = [] } = req.body;

//     // Normalize inputs
//     if (!Array.isArray(leadIds)) leadIds = [];
//     if (!Array.isArray(telecallerIds)) telecallerIds = [];

//     if (leadIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No leads provided for assignment.",
//       });
//     }

//     if (telecallerIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please select at least one telecaller.",
//       });
//     }

//     // Get active telecallers
//     const telecallers = await Employee.find({
//       _id: { $in: telecallerIds },
//       role: "Telecaller",
//       status: "active",
//     }).select("_id name email");

//     if (telecallers.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No active telecallers found from the selection.",
//       });
//     }

//     // Round-robin distribution
//     const totalLeads = leadIds.length;
//     const totalTelecallers = telecallers.length;

//     const bulkOps = [];
//     const telecallerDistribution = telecallers.map((t) => ({
//       telecallerId: t._id,
//       name: t.name,
//       assignedLeads: 0,
//     }));

//     leadIds.forEach((leadId, index) => {
//       const telecallerIndex = index % totalTelecallers;
//       const telecallerId = telecallers[telecallerIndex]._id;

//       bulkOps.push({
//         updateOne: {
//           filter: { _id: leadId },
//           update: {
//             $set: {
//               assignedToTelecaller: telecallerId,
//               lastUpdatedBy: req.user?._id,
//               updatedAt: new Date(),
//             },
//           },
//         },
//       });

//       telecallerDistribution[telecallerIndex].assignedLeads += 1;
//     });

//     // Execute bulk update
//     if (bulkOps.length > 0) {
//       await Lead.bulkWrite(bulkOps, { ordered: false });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Successfully assigned ${totalLeads} leads to ${totalTelecallers} telecaller${totalTelecallers > 1 ? "s" : ""}.`,
//       assigned: totalLeads,
//       telecallerCount: totalTelecallers,
//       distribution: telecallerDistribution,
//     });
//   } catch (error) {
//     console.error("Manual Assignment Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error assigning leads.",
//       error: error.message,
//     });
//   }
// };

// ====================== Delete Lead ======================
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting lead.",
      error: error.message,
    });
  }
};
