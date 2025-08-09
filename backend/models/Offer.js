// backend/models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true }, // np. "fotowoltaika"
  title: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [{ type: String }], // Tablica stringów
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model('Offer', offerSchema);