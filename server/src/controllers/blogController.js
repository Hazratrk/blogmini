const Blog = require('../../src/schemas/blogSchema');
const Category = require('../../src/models/categoryModel');
const User = require('../../src/models/userModel');       


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('categoryId').populate('authorId');
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('categoryId').populate('authorId');
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, image, categoryId, authorId } = req.body;

    const categoryExists = await Category.findById(categoryId);
    const authorExists = await User.findById(authorId);

    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid categoryId' });
    }
    if (!authorExists) {
      return res.status(400).json({ success: false, message: 'Invalid authorId' });
    }

    const newBlog = new Blog({ title, content, image, categoryId, authorId });
    await newBlog.save();
    res.status(201).json({
      success: true,
      data: newBlog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, categoryId } = req.body;

    if (categoryId) {
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ success: false, message: 'Invalid categoryId' });
        }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, image, categoryId },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};