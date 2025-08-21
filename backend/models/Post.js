// backend/models/Post.js
const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  images: {
    type: [String],
    required: false,
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Post', postSchema);