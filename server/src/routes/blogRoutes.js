const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');

// Multer disk 
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/'); 
},
filename: function (req, file, cb) {
cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
},
});

// Multer
const upload = multer({
storage: storage,
limits: { fileSize: 1024 * 1024 * 5 } 
});

router.get('/', blogController.getAllBlogs);


router.get('/:id', blogController.getBlogById); 


router.post('/', upload.single('image'), blogController.createBlog);


router.put('/:id', blogController.updateBlog); 



router.delete('/:id', blogController.deleteBlog);

module.exports = router;