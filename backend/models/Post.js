// backend/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  // ZMIANA: Zamiast jednego imageUrl, mamy tablicę 'images'
  images: {
    type: [String], // Oznacza tablicę stringów (ścieżek do plików)
    required: false,
    default: [] // Domyślnie pusta tablica
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);