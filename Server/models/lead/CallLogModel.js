// const mongoose = require("mongoose");

// const CallLogSchema = new mongoose.Schema({
//   phone: String,
//   digitPressed: String,
//   department: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("CallLog", CallLogSchema);

const mongoose = require("mongoose");

const CallLogSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  digitPressed: String,
  department: String,
  callStatus: {
    type: String,
    enum: ["completed", "missed", "in-progress", "failed"],
    default: "in-progress",
  },
  callSid: { type: String, unique: true, sparse: true }, // Twilio Call SID
  duration: Number,           // seconds
  recordingUrl: String,
  callerCity: String,
  callerState: String,
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CallLog", CallLogSchema);