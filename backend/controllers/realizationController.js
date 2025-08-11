// backend/controllers/realizationController.js
const Realization = require('../models/Realization');
const fs = require('fs');

exports.getAllRealizations = async (req, res) => { /* ... bez zmian ... */ };
exports.getRealizationById = async (req, res) => { /* ... bez zmian ... */ };

exports.createRealization = async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Co najmniej jedno zdjęcie jest wymagane.' });
  }
  const images = req.files.map(file => file.path.replace(/\\/g, '/'));
  const newRealization = new Realization({ title, description, category, images });
  try {
    const savedRealization = await newRealization.save();
    res.status(201).json(savedRealization);
  } catch (err) {
    images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    // ZMIANA: Odsyłamy bardziej szczegółowy komunikat o błędzie
    console.error('Błąd walidacji przy tworzeniu realizacji:', err);
    res.status(400).json({ message: `Błąd walidacji: ${err.message}` });
  }
};

exports.updateRealization = async (req, res) => { /* ... bez zmian ... */ };
exports.deleteRealization = async (req, res) => { /* ... bez zmian ... */ };