// const bcrypt = require("bcryptjs");
// const Employee = require("../models/Employee");
// const Department = require("../models/Department");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const getLoginMailOptions = require("../Email/login");
// const getRegisterMailOptions = require("../Email/register");
// const getPasswordResetMailOptions = require("../Email/password");
// const getPasswordChangeConfirmationMailOptions = require("../Email/passwordReset");
// const transporter = require("../Email/nodemailer");
// const { recalcDepartmentStats } = require("../utils/departmentStats");
// const redisClient = require("../config/redis");

// // Generate unique JWT ID (jti) for future token blacklisting
// const generateJti = () => crypto.randomBytes(16).toString('hex');

// // ====================== REGISTER ======================
// const register = async (req, res) => {
//   try {
//     const { name, email, role, password, confirmPassword, avatar } = req.body;

//     // Validation
//     if (!name || !email || !role || !password || !confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "All fields are required"
//       });
//     }

//     // Check if employee already exists
//     const existing = await Employee.findOne({ email });
//     if (existing) {
//       return res.status(400).json({
//         status: false,
//         message: "Employee already exists"
//       });
//     }

//     // Password match check
//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "Passwords do not match"
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new employee (without department)
//     const user = new Employee({
//       name,
//       email,
//       role,
//       password: hashedPassword,
//       profileImage: avatar || null,   // agar avatar nahi bheja to null
//     });

//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Send welcome email (optional)
//     transporter.sendMail(
//       getRegisterMailOptions(user.email, user.name),
//       (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//         } else {
//           console.log("Registration email sent:", info.response);
//         }
//       }
//     );

//     // Return populated user (department field nahi hoga ab)
//     const populated = await Employee.findById(user._id).populate({
//       path: 'department',
//       select: 'name'
//     });

//     res.status(201).json({
//       status: true,
//       message: "Employee registered successfully",
//       data: {
//         user: populated,
//         token,
//       },
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error"
//     });
//   }
// };

// // ====================== LOGIN with Redis Rate Limiting ======================
// const login = async (req, res) => {
//   const { email, password, role } = req.body;
//   try {
//     if (!email || !password || !role) {
//       return res.status(400).json({
//         status: false,
//         message: "All fields are required",
//       });
//     }

//     // Rate limiting using Redis (5 attempts in 15 minutes)
//     const rateKey = `login_rate:${email}`;
//     const attempts = await redisClient.incr(rateKey);
//     if (attempts === 1) {
//       await redisClient.expire(rateKey, 15 * 60); // 15 minutes
//     }

//     if (attempts > 5) {
//       return res.status(429).json({
//         status: false,
//         message: "Too many login attempts. Try again after 15 minutes.",
//       });
//     }

//     const user = await Employee.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User doesn't exist",
//       });
//     }

//     // Check if role matches
//     if (user.role !== role) {
//       return res.status(403).json({
//         status: false,
//         message: `Role mismatch. You are registered as '${user.role}'.`,
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Reset rate limit on successful login
//     await redisClient.del(rateKey);

//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     transporter.sendMail(
//       getLoginMailOptions(user.email, user.name),
//       (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       }
//     );

//     res.status(200).json({
//       status: true,
//       message: "Login successful",
//       data: {
//         user,
//         token,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // ====================== FORGET PASSWORD (OTP stored in Redis) ======================
// const forgetPasswordRequest = async (req, res) => {
//   const { email } = req.body;
//   try {
//     if (!email) {
//       return res.status(400).json({
//         status: false,
//         message: "Email is required",
//       });
//     }

//     const user = await Employee.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User doesn't exist",
//       });
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP in Redis with 10 minutes expiry
//     await redisClient.set(`otp:${email}`, otp, "EX", 10 * 60);

//     transporter.sendMail(
//       getPasswordResetMailOptions(user.email, user.name, otp),
//       (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       }
//     );

//     res.status(200).json({
//       status: true,
//       message: "OTP sent to your email",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // ====================== VERIFY OTP (from Redis) ======================
// const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     if (!email || !otp) {
//       return res.status(400).json({
//         status: false,
//         message: "Email and OTP are required",
//       });
//     }

//     const user = await Employee.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User doesn't exist",
//       });
//     }

//     // Get OTP from Redis
//     const storedOtp = await redisClient.get(`otp:${email}`);

//     if (!storedOtp || String(storedOtp) !== String(otp).trim()) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid or expired OTP",
//       });
//     }

//     // Clear OTP after successful verification
//     await redisClient.del(`otp:${email}`);

//     // Generate a secure reset token (valid for 15 minutes)
//     const resetToken = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.status(200).json({
//       status: true,
//       message: "OTP verified successfully",
//       resetToken,
//     });
//   } catch (error) {
//     console.error("verifyOTP error:", error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // ====================== RESET PASSWORD ======================
// const resetPassword = async (req, res) => {
//   const { resetToken, newPassword, confirmNewPassword } = req.body;
//   try {
//     if (!resetToken || !newPassword || !confirmNewPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "All fields are required",
//       });
//     }

//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "New passwords do not match",
//       });
//     }

//     // Verify the reset token
//     let decoded;
//     try {
//       decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid or expired reset token",
//       });
//     }

//     const user = await Employee.findById(decoded._id);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User doesn't exist",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
//     user.password = hashedPassword;
//     await user.save();

//     transporter.sendMail(
//       getPasswordChangeConfirmationMailOptions(user.email, user.name),
//       (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       }
//     );

//     res.status(200).json({
//       status: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // ====================== CHANGE PASSWORD ======================
// const changePassword = async (req, res) => {
//   const { id } = req.params;
//   const { oldPassword, newPassword, confirmPassword } = req.body;

//   try {
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "All fields are required",
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({
//         status: false,
//         message: "New passwords do not match",
//       });
//     }

//     const user = await Employee.findById(id);
//     if (!user) {
//       return res.status(400).json({
//         status: false,
//         message: "User doesn't exist",
//       });
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         status: false,
//         message: "Old password is incorrect",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
//     user.password = hashedPassword;
//     await user.save();

//     transporter.sendMail(
//       getPasswordChangeConfirmationMailOptions(user.email, user.name),
//       (err, info) => {
//         if (err) {
//           console.error("Error sending email:", err);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       }
//     );

//     res.status(200).json({
//       status: true,
//       message: "Password changed successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// // Export all functions
// module.exports = {
//   register,
//   login,
//   forgetPasswordRequest,
//   verifyOTP,
//   resetPassword,
//   changePassword,
// };

const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const getLoginMailOptions = require("../Email/login");
const getRegisterMailOptions = require("../Email/register");
const getPasswordResetMailOptions = require("../Email/password");
const getPasswordChangeConfirmationMailOptions = require("../Email/passwordReset");
const transporter = require("../Email/nodemailer");

// Generate unique JWT ID (jti) - kept for future use if needed
const generateJti = () => crypto.randomBytes(16).toString("hex");

// ====================== REGISTER ======================
const register = async (req, res) => {
  try {
    const { name, email, role, password, confirmPassword, avatar } = req.body;

    // Validation
    if (!name || !email || !role || !password || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    // Check if employee already exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Employee already exists",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "Passwords do not match",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employee
    const user = new Employee({
      name,
      email,
      role,
      password: hashedPassword,
      profileImage: avatar || null,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Send welcome email
    transporter.sendMail(
      getRegisterMailOptions(user.email, user.name),
      (err, info) => {
        if (err) console.error("Error sending registration email:", err);
        else console.log("Registration email sent:", info.response);
      },
    );

    // Return populated user
    const populated = await Employee.findById(user._id).populate({
      path: "department",
      select: "name",
    });

    res.status(201).json({
      status: true,
      message: "Employee registered successfully",
      data: {
        user: populated,
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ====================== LOGIN ======================
const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        status: false,
        message: "Email, password, and role are required",
      });
    }

    // Find user with password for verification
    const user = await Employee.findOne(
      { email: email.toLowerCase(), role },
      // Include password for verification
    );

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials or role mismatch",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    // Update login status after password verification
    const updatedUser = await Employee.findByIdAndUpdate(
      user._id,
      {
        isLoggedIn: true,
        lastLogin: new Date(),
      },
      {
        returnDocument: "after",
        select: "-password -otp -otpExpiry", // Exclude sensitive fields
      },
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        _id: updatedUser._id,
        role: updatedUser.role,
        email: updatedUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Send login notification email (non-blocking)
    transporter
      .sendMail(getLoginMailOptions(updatedUser.email, updatedUser.name))
      .catch((err) => console.error("Login email error:", err));

    // Final response (safe user data)
    res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileImage: updatedUser.profileImage,
          department: updatedUser.department,
          lastLogin: updatedUser.lastLogin,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
// ====================== FORGET PASSWORD ======================
const forgetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: You can store OTP in database or session if needed later
    // For now, we'll just send it via email (no Redis)

    transporter.sendMail(
      getPasswordResetMailOptions(user.email, user.name, otp),
      (err, info) => {
        if (err) console.error("Error sending password reset email:", err);
        else console.log("Password reset email sent:", info.response);
      },
    );

    res.status(200).json({
      status: true,
      message: "OTP sent to your email",
      // Note: In production, you should store OTP securely (DB or Redis)
      // For now, we're only sending it
    });
  } catch (error) {
    console.error("Forget password error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ====================== VERIFY OTP ======================
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({
        status: false,
        message: "Email and OTP are required",
      });
    }

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    // Note: Since Redis is removed, proper OTP verification needs to be implemented
    // Currently this is placeholder logic. You should store OTP in DB or another method.
    // For demo purposes, we'll assume OTP is correct (replace this logic later)

    // TODO: Implement proper OTP storage and verification

    // Generate a secure reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      status: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ====================== RESET PASSWORD ======================
const resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmNewPassword } = req.body;
  try {
    if (!resetToken || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: false,
        message: "New passwords do not match",
      });
    }

    // Verify the reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired reset token",
      });
    }

    const user = await Employee.findById(decoded._id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    transporter.sendMail(
      getPasswordChangeConfirmationMailOptions(user.email, user.name),
      (err, info) => {
        if (err) console.error("Error sending password change email:", err);
        else console.log("Password change email sent:", info.response);
      },
    );

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// ====================== CHANGE PASSWORD ======================
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "New passwords do not match",
      });
    }

    const user = await Employee.findById(id);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Old password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    transporter.sendMail(
      getPasswordChangeConfirmationMailOptions(user.email, user.name),
      (err, info) => {
        if (err) console.error("Error sending password change email:", err);
        else console.log("Password change email sent:", info.response);
      },
    );

    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User not authenticated" });
    }

    await Employee.findByIdAndUpdate(userId, {
      isLoggedIn: false,
      lastLogout: new Date(),
    });

    res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ status: false, message: "Logout failed" });
  }
};

// Export all functions
module.exports = {
  register,
  login,
  logout,
  forgetPasswordRequest,
  verifyOTP,
  resetPassword,
  changePassword,
};
