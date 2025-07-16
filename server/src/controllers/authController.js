const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
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

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  register,
  login,
  getMe
};