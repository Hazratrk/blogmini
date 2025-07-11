// blog-app-server/controllers/blogController.js

const Blog = require('../models/blogModel');
const mongoose = require('mongoose');


const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('categoryId').populate('authorId', 'fullName email');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Yanlış blog ID-si.' });
    }

    const blog = await Blog.findById(id).populate('categoryId').populate('authorId', 'fullName email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog tapılmadı.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createBlog = async (req, res) => {
  const { title, content, image, categoryId, authorId } = req.body;

  if (!title || !content || !categoryId || !authorId) {
    return res.status(400).json({ message: 'Zəhmət olmasa bütün sahələri doldurun (başlıq, məzmun, kateqoriya ID, müəllif ID).' });
  }


  if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ message: 'Kateqoriya ID və ya Müəllif ID yanlışdır.' });
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      image,
      categoryId,
      authorId,
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateBlog = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Yanlış blog ID-si.' });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog tapılmadı.' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Yanlış blog ID-si.' });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog tapılmadı.' });
    }
    res.status(200).json({ message: 'Blog uğurla silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};