// import Joi from "joi";

// // Register Validation
// const registerValidation = (data) => {
//   const schema = Joi.object({
//     fullName: Joi.string().min(6).required(),
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//     role: Joi.string()
//       .valid("admin")
//       .required(),
//     gender: Joi.string().valid("male", "female").required(),
//     phone: Joi.number().required(),
//   });
//   return schema.validate(data, { abortEarly: false });
// };

// const loginValidation = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().min(6).required().email(),
//     password: Joi.string().min(6).required(),
//     role: Joi.string().valid("admin", "telecaller","counsellor").required(),
//   });
//   return schema.validate(data, { abortEarly: false });
// };

// const authValidation = {
//   registerValidation,
//   loginValidation,
// };

// export default authValidation;


const Joi = require("joi");

// ====================== REGISTER VALIDATION ======================
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).trim().required()
      .messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot exceed 100 characters"
      }),

    email: Joi.string().email().trim().lowercase().required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
      }),

    password: Joi.string().min(6).max(100).required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long"
      }),

    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
      .messages({
        "any.only": "Confirm password must match with password"
      }),

    role: Joi.string()
      .valid("admin", "telecaller", "counsellor")
      .required()
      .messages({
        "any.only": "Role must be admin, telecaller or counsellor"
      }),

    department: Joi.string().allow("", null),
    departmentId: Joi.string().allow("", null),

    avatar: Joi.string().allow("", null),
    phone: Joi.string().pattern(/^[0-9]{10}$/).allow("", null)
      .messages({
        "string.pattern.base": "Phone number must be 10 digits"
      }),

    gender: Joi.string().valid("M", "F").allow("", null)
  });

  return schema.validate(data, { abortEarly: false });
};

// ====================== LOGIN VALIDATION ======================
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
      }),

    password: Joi.string().min(6).required()
      .messages({
        "string.empty": "Password is required"
      }),

    role: Joi.string()
      .valid("admin", "telecaller", "counsellor")
      .required()
      .messages({
        "any.only": "Role must be admin, telecaller or counsellor"
      })
  });

  return schema.validate(data, { abortEarly: false });
};

// ====================== FORGET PASSWORD VALIDATION ======================
const forgetPasswordValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
      })
  });

  return schema.validate(data, { abortEarly: false });
};

// ====================== VERIFY OTP VALIDATION ======================
const verifyOTPValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]{6}$/).required()
      .messages({
        "string.length": "OTP must be 6 digits",
        "string.pattern.base": "OTP must contain only numbers"
      })
  });

  return schema.validate(data, { abortEarly: false });
};

// ====================== RESET PASSWORD VALIDATION ======================
const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(6).max(100).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required()
      .messages({
        "any.only": "New passwords do not match"
      })
  });

  return schema.validate(data, { abortEarly: false });
};

const authValidation = {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
  verifyOTPValidation,
  resetPasswordValidation,
};

module.exports = authValidation;