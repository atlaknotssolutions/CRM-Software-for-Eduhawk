// // config/multer.js
// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("./cloudinary.js");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "resumes",
//     resource_type: "auto",
//     public_id: (req, file) =>
//       `${Date.now()}-${file.originalname.split(".")[0]}`,
//   },
// });

// const upload = multer({ storage });

// // export default upload;
// module.exports = upload;


const multer = require("multer");

// Disk storage (used for attendance)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;