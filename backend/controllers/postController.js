const Post = require('../models/Post');
const Joi = require('joi'); // Dodajemy Joi

// Schemat walidacji dla nowego i aktualizowanego posta
const postSchema = Joi.object({
  title: Joi.string().min(3).max(150).required().messages({
    'string.base': `"Tytuł" musi być tekstem.`,
    'string.empty': `"Tytuł" nie może być pusty.`,
    'string.min': `"Tytuł" musi mieć co najmniej {#limit} znaki.`,
    'any.required': `"Tytuł" jest wymagany.`
  }),
  content: Joi.string().min(10).required().messages({
    'string.empty': `"Treść" nie może być pusta.`,
    'string.min': `"Treść" musi mieć co najmniej {#limit} znaków.`,
    'any.required': `"Treść" jest wymagana.`
  }),
  // existingImages nie jest wymagane, ale jeśli jest, musi być tablicą stringów
  existingImages: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string())
});


const createExcerpt = (htmlContent) => { /* ... bez zmian ... */ };
exports.getAllPosts = async (req, res) => { /* ... bez zmian ... */ };
exports.getPostById = async (req, res) => { /* ... bez zmian ... */ };

exports.createPost = async (req, res) => {
  // 1. Walidacja danych wejściowych
  const { error } = postSchema.validate(req.body);
  if (error) {
    // Jeśli walidacja się nie powiedzie, zwróć błąd 400
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, content } = req.body;
  // Pliki są już przetworzone przez middleware i zawierają URL z Cloudinary
  const images = req.files ? req.files.map(file => file.path) : [];
  
  const newPost = new Post({ title, content, images });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    // Usunęliśmy fs.unlink, bo pliki są już w chmurze
    res.status(400).json({ message: 'Błąd zapisu do bazy danych.' });
  }
};

exports.updatePost = async (req, res) => {
  // 1. Walidacja danych wejściowych
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { title, content } = req.body;
    let { existingImages } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Nie znaleziono posta.' });

    if (typeof existingImages === 'string') existingImages = [existingImages];
    if (!existingImages) existingImages = [];

    // Porządki: Usunięto logikę fs.unlink, która nie jest już potrzebna.
    // Prawidłowe usunięcie starych zdjęć z Cloudinary wymagałoby osobnej logiki i wywołań API.

    const newImagePaths = req.files ? req.files.map(file => file.path) : [];
    
    post.title = title;
    post.content = content;
    post.images = [...existingImages, ...newImagePaths];

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: 'Błąd aktualizacji.' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Nie znaleziono posta.' });
    
    // Porządki: Usunięto logikę fs.unlink.
    
    await post.deleteOne();
    res.json({ message: 'Post został usunięty.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};