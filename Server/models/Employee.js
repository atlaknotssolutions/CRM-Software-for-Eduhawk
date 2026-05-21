const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    // Auth & Account
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Telecaller", "Counsellor"],
      default: "Counsellor",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isLoggedIn: { type: Boolean, default: false },
    lastLogout: { type: Date },

    // Personal Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: String,
    gender: {
      type: String,
      enum: ["M", "F"],
      default: "M",
    },
    dateOfBirth: Date,
    profileImage: {
      type: String,
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    skills: {
      type: String,
    },

    // Employment Info
    position: {
      type: String,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    employeeId: {
      type: String,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
    salary: {
      type: Number,
    },
    payType: {
      type: String,
      enum: ["hourly", "salary"],
      default: "salary",
    },
    emergencyContact: {
      type: String,
    },
    emergencyPhone: {
      type: String,
    },

    // Education & Certifications
    education: [
      {
        institution: String,
        degree: String,
        fieldOfStudy: String,
        graduationYear: Number,
      },
    ],

    // Documents
    documents: [
      {
        name: String,
        type: String,
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Custom Fields
    customFields: [
      {
        fieldName: String,
        fieldValue: String,
      },
    ],

    // OTP for password reset
    otp: String,
    otpExpiry: Date,
  },
  {
    timestamps: true,
  },
);

EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ role: 1 });

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
