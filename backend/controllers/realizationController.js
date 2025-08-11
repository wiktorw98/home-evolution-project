// backend/controllers/realizationController.js
const Realization = require('../models/Realization');
const fs = require('fs');

// Funkcje getAllRealizations i getRealizationById bez zmian
exports.getAllRealizations = async (req, res) => { /* ... */ };
exports.getRealizationById = async (req, res) => { /* ... */ };

exports.createRealization = async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'Co najmniej jedno zdjęcie jest wymagane.' });
  const images = req.files.map(file => file.path.replace(/\\/g, '/'));
  const newRealization = new Realization({ title, description, category, images });
  try {
    const saved = await newRealization.save();
    res.status(201).json(saved);
  } catch (err) {
    images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    res.status(400).json({ message: 'Błąd walidacji.' });
  }
};

exports.updateRealization = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    let { existingImages } = req.body;
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });

    if (typeof existingImages === 'string') existingImages = [existingImages];
    if (!existingImages) existingImages = [];

    const imagesToDelete = realization.images.filter(img => !existingImages.includes(img));
    imagesToDelete.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));

    const newImagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];
    
    realization.title = title;
    realization.description = description;
    realization.category = category;
    realization.images = [...existingImages, ...newImagePaths];

    const updated = await realization.save();
    res.json(updated);
  } catch (err) { res.status(400).json({ message: 'Błąd aktualizacji.' }); }
};

exports.deleteRealization = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    if (realization.images && realization.images.length > 0) {
      realization.images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    }
    await realization.deleteOne();
    res.json({ message: 'Realizacja została usunięta.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};