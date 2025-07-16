const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const newUser = await User.create({ fullName, email, password, role });
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = generateToken(payload);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/profile", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;

router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
