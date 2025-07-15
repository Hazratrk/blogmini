const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); 


const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();


  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), 
    httpOnly: true, 
  };


  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    data: {
      token, 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    },
    message: 'İşlem başarıyla tamamlandı.',
  });
};



const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;


  const user = await User.create({
    fullName,
    email,
    password, 
  });

  sendTokenResponse(user, 201, res);
});



const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;


  if (!email || !password) {
    res.status(400);
    throw new Error('Lütfen email ve şifre girin.');
  }

 
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Yanlış kimlik bilgileri.');
  }


  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Yanlış kimlik bilgileri.');
  }

  sendTokenResponse(user, 200, res);
});


const getMe = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('-password'); 

  res.status(200).json({
    success: true,
    data: user,
    message: 'Kullanıcı bilgileri başarıyla alındı.'
  });
});


module.exports = {
  register,
  login,
  getMe,
};