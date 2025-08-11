// backend/controllers/realizationController.js
const Realization = require('../models/Realization');
const fs = require('fs');

exports.getAllRealizations = async (req, res) => {
  try {
    const realizations = await Realization.find().sort({ createdAt: -1 });
    res.json(realizations);
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};

exports.getRealizationById = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    res.json(realization);
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};

exports.createRealization = async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Co najmniej jedno zdjęcie jest wymagane.' });
  }
  const images = req.files.map(file => file.path);
  const newRealization = new Realization({ title, description, category, images });
  try {
    const savedRealization = await newRealization.save();
    res.status(201).json(savedRealization);
  } catch (err) {
    images.forEach(path => fs.unlink(path, (e) => { if (e) console.error(e); }));
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
    imagesToDelete.forEach(imagePath => fs.unlink(imagePath, (err) => { if (err) console.error(err); }));

    const newImagePaths = req.files ? req.files.map(file => file.path) : [];
    
    realization.title = title;
    realization.description = description;
    realization.category = category;
    realization.images = [...existingImages, ...newImagePaths];

    const updatedRealization = await realization.save();
    res.json(updatedRealization);
  } catch (err) {
    res.status(400).json({ message: 'Błąd aktualizacji.' });
  }
};

exports.deleteRealization = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    
    if (realization.images && realization.images.length > 0) {
      realization.images.forEach(imagePath => fs.unlink(imagePath, (err) => { if (err) console.error(err); }));
    }
    await realization.deleteOne();
    res.json({ message: 'Realizacja została usunięta.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};