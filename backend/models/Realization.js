// backend/models/Realization.js

const mongoose = require('mongoose');

const realizationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // Tutaj będziemy przechowywać ścieżkę do pliku na serwerze
    required: true
  },
  category: {
    type: String, // np. "Fotowoltaika", "Ocieplenia"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Realization', realizationSchema);