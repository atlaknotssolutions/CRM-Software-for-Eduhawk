// import express from "express";
// import {
//   register,
//   login,
//   forgetPasswordRequest,
//   verifyOTP,
//   resetPassword,
//   changePassword,
// } from "../controller/authController.js";
// import authorize from "../middlewares/authorize.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/forget-password", forgetPasswordRequest);
// router.post("/verify-otp", verifyOTP);
// router.post("/reset-password", resetPassword);
// router.put("/change-password/:id", authorize(['employee', 'hr']), changePassword);

// export default router;

const express = require("express");
const {
  register,
  login,
  logout,
  forgetPasswordRequest,
  verifyOTP,
  resetPassword,
  changePassword,
} = require("../controller/authController.js"); // ← yahan .js nahi likhte CommonJS mein

const authorize = require("../middlewares/authorize");

const router = express.Router();

// Routes
router.post("/register", register);
router.post("/login", login);
router.post(
  "/logout",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  logout,
);
router.post("/forget-password", forgetPasswordRequest);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.put(
  "/change-password/:id",
  authorize(["Admin", "Counsellor", "Telecaller"]),
  changePassword,
);

module.exports = router;
