const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  getCategoryById,
 
} = require("../controllers/catergoryController");

router.get("/", getAllCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);


module.exports = router;
