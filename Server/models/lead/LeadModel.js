const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  parentName: { type: String, default: "" },
  city: String,
  email: String,
  neetStatus: String,
  budget: { type: Number, default: "" },
  preferredCountry: String,

  source: { type: String, default: "IVR" },
  assignedTo: String,

  assignedToTelecaller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  assignedToCounsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },

  status: {
    type: String,
    enum: [
      "New",
      "Not Interested",
      "Call Back",
      "Interested",
      "Converted",
      "Dropped",
    ],
    default: "New",
  },

  leadTag: {
    type: String,
    enum: ["Hot", "Warm", "Cold"],
    default: "Warm",
  },

  remarks: [
    {
      text: String,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      date: { type: Date, default: Date.now },
    },
  ],

  // Track who last updated the lead
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },

  // New fields for telecaller visibility and progress tracking
  isVisibleToTelecaller: { type: Boolean, default: true },
  progress: {
    type: String,
    enum: [
      "Initial Contact",
      "Documents Collected",
      "Application Submitted",
      "Admission Received",
      "Visa Processing",
      "Visa Approved",
      "Ticket Booked",
      "Completed",
    ],
    default: "Initial Contact",
  },

  lastFollowUp: Date,
  lastRemark: String,
  counsellorRemark: String,

  followUpDate: Date,
  registrationFeePaid: { type: Boolean, default: false },
  documentsSubmitted: { type: Boolean, default: false },
  documentFileReady: { type: Boolean, default: false },
  collegeApplicationDone: { type: Boolean, default: false },
  admissionLetterIssued: { type: Boolean, default: false },
  visaApplied: { type: Boolean, default: false },
  visaIssued: { type: Boolean, default: false },
  ticketBooked: { type: Boolean, default: false },
  departureDate: Date,
  departureStatus: { type: Boolean, default: false },

  collegeName: String,
  emergencyContact: String,
  serviceManager: String, // Stored as name string from Excel (not ObjectId)

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lead", leadSchema);
