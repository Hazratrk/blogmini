const CategoryModel = require("../models/categoryModel");

//get all
const getAll = async () =>
  await CategoryModel.find().populate("products").lean();

//get one
const getOne = async (id) =>
  await CategoryModel.findById(id).populate("products", "title").lean();
//post
const post = async (payload) => await CategoryModel.create(payload);


module.exports = {
  getAll,
  getOne,
  post
};