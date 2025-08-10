// backend/controllers/postController.js

const Post = require('../models/Post');

// --- Pobieranie wszystkich postów (BEZ ZMIAN) ---
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów.' });
  }
};

// === NOWA FUNKCJA: POBIERANIE JEDNEGO POSTA PO ID ===
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta o podanym ID' });
    }
    res.json(post);
  } catch (err) {
    console.error('Błąd przy pobieraniu pojedynczego posta:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// --- Tworzenie nowego posta (BEZ ZMIAN) ---
exports.createPost = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  const newPost = new Post({
    title,
    content,
    imageUrl
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

// --- Usuwanie posta (BEZ ZMIAN) ---
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta.' });
    }

    await post.deleteOne();
    res.json({ message: 'Post został usunięty.' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy usuwaniu posta.' });
  }
};