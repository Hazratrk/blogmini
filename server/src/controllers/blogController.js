// controllers/blogController.js
const Blog = require('../models/blogModel');


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('categoryId').populate('authorId'); // Kateqoriya və müəllif məlumatlarını gətir
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('categoryId').populate('authorId');
    if (!blog) {
      return res.status(404).json({ message: 'Blog tapılmadı.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createBlog = async (req, res) => {
  const { title, content, image, categoryId, authorId } = req.body;
  try {
    const newBlog = new Blog({ title, content, image, categoryId, authorId });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, categoryId } = req.body; 
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, image, categoryId },
      { new: true, runValidators: true } 
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog tapılmadı.' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
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