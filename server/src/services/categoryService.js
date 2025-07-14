const CategoryModel = require("../models/categoryModel");

//get all
const getAll = async () =>
  await CategoryModel.find().populate("products").lean();


const getOne = async (id) =>
  await CategoryModel.findById(id).populate("products", "title").lean();

const post = async (payload) => await CategoryModel.create(payload);


module.exports = {
  getAll,
  getOne,
  post
};