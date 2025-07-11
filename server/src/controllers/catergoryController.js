// blog-app-server/controllers/categoryController.js

const Category = require('../models/categoryModel');
const Blog = require('../models/blogModel'); // To find blogs by category
const mongoose = require('mongoose');


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    console.log(categories)
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

 
  if (!name) {
    return res.status(400).json({ message: 'Zəhmət olmasa kateqoriya adını daxil edin.' });
  }

  try {
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    // Handle duplicate category name error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Bu kateqoriya adı artıq mövcuddur.' });
    }
    res.status(400).json({ message: error.message });
  }
};


const getBlogsByCategory = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Yanlış kateqoriya ID-si.' });
    }

    const blogs = await Blog.find({ categoryId: id }).populate('categoryId').populate('authorId', 'fullName email');
    
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Bu kateqoriyaya aid blog tapılmadı.' });
    }

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllCategories,
  createCategory,
  getBlogsByCategory,
};