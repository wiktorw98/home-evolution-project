// backend/controllers/postController.js
const Post = require('../models/Post');
const fs = require('fs'); // Importujemy moduł 'fs' do operacji na plikach

// Funkcja getAllPosts i getPostById pozostają bez zmian
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów.' });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta o podanym ID' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// --- ZMIANA: Aktualizujemy funkcję tworzenia posta ---
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  
  // Pobieramy tablicę ścieżek do zapisanych plików z req.files (dzięki multerowi)
  const images = req.files ? req.files.map(file => file.path) : [];

  const newPost = new Post({
    title,
    content,
    images // Zapisujemy nową tablicę ścieżek
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

// --- ZMIANA: Aktualizujemy funkcję usuwania posta, aby usuwała też pliki ---
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta.' });
    }

    // Usuwamy wszystkie powiązane obrazy z serwera
    if (post.images && post.images.length > 0) {
      post.images.forEach(imagePath => {
        fs.unlink(imagePath, (err) => {
          if (err) console.error(`Błąd przy usuwaniu pliku ${imagePath}:`, err);
        });
      });
    }

    await post.deleteOne();
    res.json({ message: 'Post został usunięty.' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy usuwaniu posta.' });
  }
};