const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (_, file) => {
    const fileExtension = path.extname(file.originalname).substring(1);
    const publicId = `${file.fieldname}-${Date.now()}`; //set to cloudinary

    return {
      public_id: publicId,
      format: fileExtension,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //limit for per file is 5MB
  },
  fileFilter: (_, file, cb) => {
    if (!allowedFormats.includes(file.mimetype)) {
      const err = new Error("Only JPEG, PNG, and WebP images are allowed");
      err.code = "INVALID_FILE_TYPE";
      return cb(err, false);
    }
    cb(null, true);
  },
});

module.exports = upload;
