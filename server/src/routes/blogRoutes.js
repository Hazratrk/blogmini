const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');
const mongoose = require('mongoose');



router.post('/', async (req, res) => {
  try {
    const { title, content, user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const newBlog = new Blog({ title, content, user });
    await newBlog.save();
    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('user', 'name email');
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/:id', async (req, res) => {
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


router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
