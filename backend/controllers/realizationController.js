const Realization = require('../models/Realization');
const Joi = require('joi');

const realizationSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    'string.empty': `"Tytuł" nie może być pusty.`,
    'string.min': `"Tytuł" musi mieć co najmniej {#limit} znaki.`,
    'any.required': `"Tytuł" jest wymagany.`
  }),
  description: Joi.string().min(10).required().messages({
    'string.empty': `"Opis" nie może być pusty.`,
    'string.min': `"Opis" musi mieć co najmniej {#limit} znaków.`,
    'any.required': `"Opis" jest wymagany.`
  }),
  category: Joi.alternatives().try(
    Joi.array().items(Joi.string()).min(1), 
    Joi.string()
  ).required().messages({
    'any.required': `"Kategoria" jest wymagana.`,
    'array.min': `Musisz wybrać co najmniej jedną kategorię.`
  }),
  existingImages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string())
});

exports.getAllRealizations = async (req, res) => {
  try {
    if (req.query.forSitemap) {
      const realizations = await Realization.find({}).select('_id updatedAt');
      return res.json(realizations);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const skip = (page - 1) * limit;
    const query = {};
    if (category && category !== 'Wszystkie') {
      query.category = { $in: [category] };
    }
    const totalRealizations = await Realization.countDocuments(query);
    const totalPages = Math.ceil(totalRealizations / limit);
    const realizations = await Realization.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ realizations, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};

exports.getRealizationById = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    res.json(realization);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};

exports.createRealization = async (req, res) => {
  const { error } = realizationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Co najmniej jedno zdjęcie jest wymagane.' });
  }
  let { title, description, category } = req.body;
  if (category && !Array.isArray(category)) {
    category = [category];
  }
  const images = req.files.map(file => file.path);
  const newRealization = new Realization({ title, description, category, images });
  try {
    const savedRealization = await newRealization.save();
    res.status(201).json(savedRealization);
  } catch (err) {
    res.status(400).json({ message: `Błąd zapisu: ${err.message}` });
  }
};

exports.updateRealization = async (req, res) => {
  const { error } = realizationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    let { title, description, category } = req.body;
    let { existingImages } = req.body;
    if (category && !Array.isArray(category)) {
        category = [category];
    }
    const realization = await Realization.findById(req.params.id);
    if (!realization) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    if (typeof existingImages === 'string') existingImages = [existingImages];
    if (!existingImages) existingImages = [];
    const newImagePaths = req.files ? req.files.map(file => file.path) : [];
    if (existingImages.length === 0 && newImagePaths.length === 0) {
      return res.status(400).json({ message: 'Realizacja musi posiadać co najmniej jedno zdjęcie.' });
    }
    realization.title = title;
    realization.description = description;
    realization.category = category;
    realization.images = [...existingImages, ...newImagePaths];
    const updatedRealization = await realization.save();
    res.json(updatedRealization);
  } catch (err) {
    res.status(400).json({ message: `Błąd aktualizacji: ${err.message}` });
  }
};

exports.deleteRealization = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    await realization.deleteOne();
    res.json({ message: 'Realizacja została usunięta.' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};