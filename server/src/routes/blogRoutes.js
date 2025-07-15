const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const mongoose = require('mongoose');
const { protect } = require('../middlewares/authMiddleware'); // 🛡 Token yoxlama

// Yeni blog yarat
router.post('/', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title və content tələb olunur' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const newBlog = new Blog({
      title,
      content,
      user: req.user._id // 🔐 İstifadəçi token-dən alınır
    });

    await newBlog.save();

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bütün blogları getir
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('user', 'fullName email');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Blog redaktə et
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Blog sil
router.delete('/:id', protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog silindi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
