const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      // 👇 BURANI ƏLAVƏ ET — Konsola user çıxar
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      return next();
    } catch (error) {
      console.error("Token yoxlama xətası:", error);
      return res.status(401).json({ success: false, message: 'Token etibarsızdır' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tapılmadı' });
  }
};

module.exports = { protect };
