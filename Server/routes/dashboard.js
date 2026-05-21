const express = require("express");
const {
  getDashboardData,
  getLeadPerformance,
} = require("../controller/dashboardController.js");
const router = express.Router();
const authorize = require("../middlewares/authorize.js");
router.get("/performance", authorize(["Admin"]), getLeadPerformance);
router.get(
  "/",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  getDashboardData,
);

module.exports = router;
