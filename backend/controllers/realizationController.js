// backend/controllers/realizationController.js
const Realization = require('../models/Realization');
const fs = require('fs');

exports.getAllRealizations = async (req, res) => {
  try {
    const realizations = await Realization.find().sort({ createdAt: -1 });
    res.json(realizations);
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};

// NOWA FUNKCJA
exports.getRealizationById = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    res.json(realization);
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};

exports.createRealization = async (req, res) => {
  const { title, description, category } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Zdjęcie jest wymagane.' });
  const newRealization = new Realization({ title, description, category, imageUrl: req.file.path });
  try {
    const savedRealization = await newRealization.save();
    res.status(201).json(savedRealization);
  } catch (err) { res.status(400).json({ message: 'Błąd walidacji.' }); }
};

// NOWA FUNKCJA
exports.updateRealization = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });

    realization.title = title;
    realization.description = description;
    realization.category = category;

    if (req.file) {
      fs.unlink(realization.imageUrl, (err) => { if (err) console.error(err); });
      realization.imageUrl = req.file.path;
    }

    const updatedRealization = await realization.save();
    res.json(updatedRealization);
  } catch (err) { res.status(400).json({ message: 'Błąd aktualizacji.' }); }
};

exports.deleteRealization = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    
    fs.unlink(realization.imageUrl, (err) => { if (err) console.error(err); });

    await realization.deleteOne();
    res.json({ message: 'Realizacja została usunięta.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};