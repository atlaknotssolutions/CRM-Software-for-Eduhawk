// import express from "express";
// import {
//     getAllEmployees,
//     getEmployeeById,
//     createEmployee,
//     updateEmployee,
//     editEmployee,
//     deleteEmployee 
// } from "../controllers/employeeController.js";
// import authorize from "../middlewares/authorize.js";
// import upload from "../config/multer.js";
// import uploadProfile from "../config/multerProfile.js";
// import { resumeUpload, profileUpload } from "../controllers/employeeController.js";


// const router = express.Router(); 

// router.get("/", authorize(["hr"]), getAllEmployees);
// router.get("/:id", authorize(["employee", "hr"]), getEmployeeById);
// router.post("/create", authorize(["hr"]), createEmployee);
// router.put("/update/:id", authorize(["employee", "hr"]), updateEmployee);
// router.put("/edit/:id", authorize(["employee","hr"]), editEmployee);
// router.delete("/delete/:id", authorize(["hr"]), deleteEmployee);
// router.put("/upload-resume/:id", upload.single("resume"), resumeUpload);
// router.put("/upload-profile/:id", authorize(["employee","hr"]), uploadProfile.single("profile"), profileUpload);

// export default router;

// import express from "express";
// import {
//     getAllEmployees,
//     getEmployeeById,
//     createEmployee,
//     updateEmployee,
//     editEmployee,
//     deleteEmployee,
//     resumeUpload,
//     profileUpload 
// } from "../controllers/employeeController.js";

// import authorize from "../middlewares/authorize.js";
// import upload from "../config/multer.js";
// import uploadProfile from "../config/multerProfile.js";

// const router = express.Router(); 

// // Get all employees - Only HR
// router.get("/", authorize(["hr"]), getAllEmployees);

// // Get single employee - Employee himself or HR
// router.get("/:id", authorize(["employee", "hr"]), getEmployeeById);

// // Create new employee - Only HR
// router.post("/create", authorize(["hr"]), createEmployee);

// // Update employee (full update) - Employee or HR
// router.put("/update/:id", authorize(["employee", "hr"]), updateEmployee);

// // Edit employee (partial update) - Employee or HR
// router.put("/edit/:id", authorize(["employee", "hr"]), editEmployee);

// // Delete employee - Only HR
// router.delete("/delete/:id", authorize(["hr"]), deleteEmployee);

// // Upload Resume - No authorization (or you can add if needed)
// router.put("/upload-resume/:id", upload.single("resume"), resumeUpload);

// // Upload Profile Picture - Employee or HR
// router.put("/upload-profile/:id", 
//     authorize(["employee", "hr"]), 
//     uploadProfile.single("profile"), 
//     profileUpload
// );

// export default router;

const express = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  editEmployee,
  deleteEmployee,
  resumeUpload,
  profileUpload,
  getTelecallers,
  getCounsellors,
} = require("../controller/employeeController.js");

const authorize = require ("../middlewares/authorize.js");
const upload = require( "../config/multer.js");
const uploadProfile = require( "../config/multerProfile.js");

const router = express.Router();

// ====================== Employee CRUD Routes ======================

// Get all employees → Only HR
router.get("/", authorize(['Admin']), getAllEmployees);

// Get single employee → Employee (himself) or HR
router.get("/:id",authorize(['Admin', 'Counsellor', 'Telecaller']), getEmployeeById);

// Create new employee → Only HR
router.post("/create", authorize(['Admin']), createEmployee);

// Full update employee → Employee or HR
router.put("/update/:id", authorize(['Admin', 'Counsellor', 'Telecaller']), updateEmployee);

// Partial edit employee → Employee or HR
router.put("/edit/:id", authorize(['Admin', 'Counsellor', 'Telecaller']), editEmployee);

// Delete employee → Only HR
router.delete("/delete/:id", authorize(['Admin']), deleteEmployee);

// ====================== File Upload Routes ======================

// Upload Resume → Secured (Recommended)
router.put(
  "/upload-resume/:id",
 authorize(['Admin', 'Counsellor', 'Telecaller']),          // ← Added security
  upload.single("resume"),
  resumeUpload
);

// Upload Profile Picture → Secured
router.put(
  "/upload-profile/:id",
  authorize(['Admin', 'Counsellor', 'Telecaller']),
  uploadProfile.single("profile"),
  profileUpload
);

router.get("/telecallers", authorize(['Admin']), getTelecallers);
router.get("/counsellors", authorize(['Admin']), getCounsellors);

module.exports = router;
