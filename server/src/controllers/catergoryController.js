//src/controllers/categoryController.js

const Category = require("../models/categoryModel");
const asyncHandler = require('express-async-handler'); 


const getAllCategories = asyncHandler(async (req, res) => { 
  const categories = await Category.find();
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories 
  });
});


const createCategory = asyncHandler(async (req, res) => { 
  const { name } = req.body; 

  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this name already exists.');
  }

  const newCategory = new Category({ name }); 
  const saved = await newCategory.save();
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: saved
  });
});



const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
      res.status(404);
      throw new Error("Category not found"); 
  }
  res.status(200).json({
      success: true,
      data: category
  });
});


module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
};