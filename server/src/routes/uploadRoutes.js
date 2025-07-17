// backend/src/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); 
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware'); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-uploads', 
    format: async (req, file) => 'png', 
    public_id: (req, file) => `blog-image-${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage: storage });


router.post('/image', protect, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully!',
    imageUrl: req.file.path, 
  });
}));

module.exports = router;