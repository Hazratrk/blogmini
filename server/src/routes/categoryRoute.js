const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/catergoryController");


router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.get("/:id/blogs", categoryController.getBlogsByCategory);

module.exports = router;
