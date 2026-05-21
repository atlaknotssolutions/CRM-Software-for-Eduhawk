const express = require("express");
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
  assignDevice,
  returnDevice,
  getMyDevices,
} = require("../../controller/devicecontroller/deviceController.js");
const authorize = require("../../middlewares/authorize.js");

const router = express.Router();

// Get devices for current user (employees) or all for HR/admin
router.get(
  "/me",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  getMyDevices,
);

// Search devices (HR/admin)
router.get(
  "/search",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  searchDevices,
);

// Get all devices (HR/admin)
router.get("/", authorize(["Admin", "Counsellor", "Telecaller"]), getDevices);

// Get device by ID
router.get(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  getDeviceById,
);

// Create device
router.post(
  "/",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  createDevice,
);

// Update device
router.put(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  updateDevice,
);

// Delete device
router.delete(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  deleteDevice,
);

// Assign device to employee
router.post(
  "/:id/assign",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  assignDevice,
);

// Mark device as returned
router.post(
  "/:id/return",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  returnDevice,
);

module.exports = router;
