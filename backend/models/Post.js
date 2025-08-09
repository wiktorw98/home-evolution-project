// backend/models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Tytuł jest wymagany
    trim: true      // Usuwa białe znaki z początku i końca
  },
  content: {
    type: String,
    required: true  // Treść jest wymagana
  },
  imageUrl: {
    type: String,   // Ścieżka do obrazka
    required: false // Obrazek nie jest obowiązkowy
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatycznie ustawia datę utworzenia
  }
});

// Tworzymy i eksportujemy model 'Post' na podstawie powyższego schematu
module.exports = mongoose.model('Post', postSchema);