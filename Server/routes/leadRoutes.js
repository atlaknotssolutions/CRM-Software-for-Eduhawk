const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  bulkUploadLeads,
  bulkUploadLeadsWithoutAssignment,
  assignLeadsManually,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addLead,
  getCounsellorLeads,
  getTelecallerLeads,
} = require("../controller/leadController");

const authorize = require("../middlewares/authorize.js");
const leadUpload = multer({ storage: multer.memoryStorage() });
const diskUpload = require("../middlewares/multer");

// ===================== LEAD ROUTES =====================
// router.post("/bulk-upload", leadUpload.single("file"), bulkUploadLeads);
router.post(
  "/bulk-upload-unassigned",
  leadUpload.single("file"),
  bulkUploadLeadsWithoutAssignment,
);
router.post("/assign-manual", assignLeadsManually);
router.get("/", getAllLeads);
router.post("/add", addLead);

// Specific routes before parameterized
router.get(
  "/telecallers",
  // protect,
  authorize(["Telecaller"]),
  getTelecallerLeads,
);

// 🔹 Counsellor - sirf Converted leads
router.get(
  "/counsellor",
  // protect,
  authorize(["Admin", "Counsellor", "Telecaller"]),
  getCounsellorLeads,
);

router.get("/:id", getLeadById);
router.put(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  updateLead,
);
router.delete("/:id", deleteLead);

module.exports = router;
