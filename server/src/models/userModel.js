// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
}, {
  timestamps: true, // createdAt və updatedAt avtomatik əlavə edir
});

module.exports = mongoose.model('User', userSchema);