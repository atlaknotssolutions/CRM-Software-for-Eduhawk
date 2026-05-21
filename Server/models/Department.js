
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    description: {
      type: String,
      trim: true
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    },
    location: {
      type: String,
      trim: true
    },
    budget: {
      type: Number,
      default: 0,
      min: 0
    },
    employeeCount: {
      type: Number,
      default: 0,
      min: 0
    },
    averageSalary: {
      type: Number,
      default: 0,
      min: 0
    },
    established: {
      type: Date,
      default: Date.now
    },
  },
  {
    timestamps: true,   // createdAt aur updatedAt automatically add hoga
  }
);

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;