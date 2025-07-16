// backend/src/controllers/blogController.js

const Blog = require('../schemas/blogSchema');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// Get all blogs
exports.getBlogs = asyncHandler(async (req, res) => { // Renamed to `getBlogs` for consistency
  const blogs = await Blog.find()
    .populate('categoryId', 'name')
    .populate('authorId', 'fullName email');

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});

// Get single blog by ID
exports.getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID format.' });
  }

  const blog = await Blog.findById(id)
    .populate('categoryId', 'name')
    .populate('authorId', 'fullName email');

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }
  res.status(200).json({
    success: true,
    data: blog
  });
});

// Create a blog
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content, categoryId, authorId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !content || !categoryId || !authorId) {
    const missingFields = [];
    if (!title) missingFields.push('Title');
    if (!content) missingFields.push('Content');
    if (!categoryId) missingFields.push('Category ID');
    if (!authorId) missingFields.push('Author ID');
    res.status(400);
    throw new Error(`The following fields are required: ${missingFields.join(', ')}.`);
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ success: false, message: 'Invalid categoryId format.' });
  }
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ success: false, message: 'Invalid authorId format.' });
  }

  const categoryExists = await Category.findById(categoryId);
  const authorExists = await User.findById(authorId);

  if (!categoryExists) {
    return res.status(400).json({ success: false, message: 'Category not found with the provided ID.' });
  }
  if (!authorExists) {
    return res.status(400).json({ success: false, message: 'Author not found with the provided ID.' });
  }

  const newBlog = new Blog({
    title,
    content,
    image: imageUrl,
    categoryId,
    authorId
  });

  await newBlog.save();

  const createdBlog = await Blog.findById(newBlog._id)
    .populate('categoryId', 'name')
    .populate('authorId', 'fullName email');

  res.status(201).json({
    success: true,
    data: createdBlog
  });
});

// Update a blog
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID format for update.' });
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (imageUrl) updateFields.image = imageUrl;

  if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({ success: false, message: 'Invalid categoryId format for update.' });
      }
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
          return res.status(400).json({ success: false, message: 'Category not found with the provided ID for update.' });
      }
      updateFields.categoryId = categoryId;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    updateFields,
    { new: true, runValidators: true }
  )
  .populate('categoryId', 'name')
  .populate('authorId', 'fullName email');

  if (!updatedBlog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  res.status(200).json({
    success: true,
    data: updatedBlog
  });
});

// Delete a blog
exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID format for deletion.' });
  }

  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    return res.status(404).json({
      success: false,
      message: 'Blog not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully'
  });
});