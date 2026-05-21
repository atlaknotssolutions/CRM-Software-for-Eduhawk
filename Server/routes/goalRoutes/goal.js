const express = require("express");
const {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../../controller/goalcontroller/goalController.js");
const authorize = require("../../middlewares/authorize.js");

const router = express.Router();

// All goal operations require auth; employees can only access their own, HR can pass employeeId to filter or manage anyone
router.get("/", authorize(["Admin", "Counsellor", "Telecaller"]), getGoals);
router.get(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  getGoalById,
);
router.post("/", authorize(["Admin", "Counsellor", "Telecaller"]), createGoal);
router.put(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  updateGoal,
);
router.delete(
  "/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  deleteGoal,
);

module.exports = router;
