// config/multerProfile.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

// Allowed image types
const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    folder: "profiles",
    resource_type: "image",
    public_id: `profile-${Date.now()}-${file.originalname.split(".")[0]}`,
    transformation: [
      { width: 500, height: 500, crop: "fill" }, // Resize & crop to square
      { quality: "auto" }, // Optimize quality
    ],
  }),
});

// File filter for security
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG, and WebP images are allowed!"), false);
  }
};

// Multer configuration
const uploadProfile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB maximum file size (recommended for profile pics)
  },
});

module.exports = uploadProfile;
