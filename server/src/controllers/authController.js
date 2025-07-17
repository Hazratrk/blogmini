//authController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Blog = require('../schemas/blogSchema'); 
const jwt = require('jsonwebtoken'); 


const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(); 

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
};


const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    fullName: fullName.trim(),
    email: email.toLowerCase().trim(),
    password
  });

  sendTokenResponse(user, 201, res);
});


const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  sendTokenResponse(user, 200, res);
});


const getMe = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }


  const blogCount = await Blog.countDocuments({ authorId: user._id });

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      blogCount: blogCount 
    }
  });
});


const updateProfile = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;

  const fieldsToUpdate = {};
  if (fullName) {
    fieldsToUpdate.fullName = fullName.trim();
  }
  if (email) {
    fieldsToUpdate.email = email.toLowerCase().trim();
    
    if (fieldsToUpdate.email && fieldsToUpdate.email !== req.user.email) {
        const existingUser = await User.findOne({ email: fieldsToUpdate.email });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            res.status(400);
            throw new Error('Email is already in use by another user');
        }
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true, 
    runValidators: true 
  }).select('-password'); 

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});


const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error('Please provide current password, new password, and confirm new password');
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('New password and confirm password do not match');
  }

  const user = await User.findById(req.user.id).select('+password'); // Şifrəni də gətiririk

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save(); 


  sendTokenResponse(user, 200, res);
});


module.exports = {
  register,
  login,
  getMe, 
  updateProfile, 
  updatePassword 
};