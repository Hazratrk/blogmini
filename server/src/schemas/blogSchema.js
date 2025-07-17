// backend/src/schemas/blogSchema.js

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  imageUrl: { 
    type: String,

    default: 'https://mailrelay.com/wp-content/uploads/2018/03/que-es-un-blog-1.png' 
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Category ID is required'],
    ref: 'Category'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Author ID is required'],
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Blog', blogSchema);