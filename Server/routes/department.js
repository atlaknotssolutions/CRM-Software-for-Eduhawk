const express = require("express");
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  getDepartmentsPublicList,
} = require("../controller/departmentController.js");

const authorize = require("../middlewares/authorize.js");

const router = express.Router();

// Place search before dynamic :id to avoid route shadowing
// Public minimal list for unauthenticated clients
router.get("/public-list", getDepartmentsPublicList);
router.get(
  "/",
  authorize(["Telecaller", "Admin", "Counsellor"]),
  getAllDepartments,
);
router.get(
  "/search",
  authorize(["Telecaller", "Admin", "Counsellor"]),
  searchDepartments,
);
router.get(
  "/:id",
  authorize(["Telecaller", "Admin", "Counsellor"]),
  getDepartmentById,
);
router.post("/", createDepartment);
router.post("/create", createDepartment);
router.put("/:id", authorize(["Admin"]), updateDepartment);
router.delete("/:id", authorize(["Admin"]), deleteDepartment);

module.exports = router;
