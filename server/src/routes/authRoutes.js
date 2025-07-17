// backend/src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); 


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); 
router.put('/updateprofile', protect, updateProfile); 
router.put('/updatepassword', protect, updatePassword); 
module.exports = router;