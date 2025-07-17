// backend/src/controllers/blogController.js

const Blog = require('../schemas/blogSchema');
const Category = require('../models/categoryModel');
const User = require('../models/userModel'); 
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');


exports.getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate('categoryId', 'name')
    .populate('authorId', 'fullName email');

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs
  });
});


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


exports.createBlog = asyncHandler(async (req, res) => {

  const { title, content, categoryId, imageUrl } = req.body;
  
 
  const authorId = req.user.id;

  if (!title || !content || !categoryId) { 
    const missingFields = [];
    if (!title) missingFields.push('Title');
    if (!content) missingFields.push('Content');
    if (!categoryId) missingFields.push('Category ID');
    res.status(400);
    throw new Error(`The following fields are required: ${missingFields.join(', ')}.`);
  }


  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ success: false, message: 'Invalid categoryId format.' });
  }


  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ success: false, message: 'Invalid authorId format (from token).' });
  }


  const categoryExists = await Category.findById(categoryId);
  const authorExists = await User.findById(authorId);

  if (!categoryExists) {
    return res.status(400).json({ success: false, message: 'Category not found with the provided ID.' });
  }
  if (!authorExists) {

    return res.status(400).json({ success: false, message: 'Author not found with the provided ID (based on token).' });
  }

  const newBlog = new Blog({
    title,
    content,
    imageUrl: imageUrl, 
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



exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId, imageUrl } = req.body; 

  // ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID format for update.' });
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (imageUrl !== undefined) updateFields.imageUrl = imageUrl; 

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


  const blogToUpdate = await Blog.findById(id);
  if (!blogToUpdate) {
    return res.status(404).json({ success: false, message: 'Blog not found.' });
  }

  if (blogToUpdate.authorId.toString() !== req.user.id) {
    res.status(403); 
    throw new Error('Not authorized to update this blog. You are not the author.');
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
      message: 'Blog not found after update attempt.'
    });
  }

  res.status(200).json({
    success: true,
    data: updatedBlog
  });
});


exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID format for deletion.' });
  }

  const blogToDelete = await Blog.findById(id);
  if (!blogToDelete) {
    return res.status(404).json({ success: false, message: 'Blog not found.' });
  }


  if (blogToDelete.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403); 
    throw new Error('Not authorized to delete this blog. You are not the author or an admin.');
  }

  await Blog.deleteOne({ _id: id }); 

  res.status(200).json({
    success: true,
    message: 'Blog deleted successfully'
  });
});