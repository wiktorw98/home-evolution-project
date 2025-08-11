// backend/controllers/postController.js
const Post = require('../models/Post');
const fs = require('fs');

// --- ZMIANA: Logika paginacji w getAllPosts ---
exports.getAllPosts = async (req, res) => {
  try {
    // Pobieramy parametry paginacji z zapytania URL, z wartościami domyślnymi
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Domyślnie 6 postów na stronę
    const skip = (page - 1) * limit;

    // Pobieramy łączną liczbę postów, aby obliczyć liczbę stron
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // Pobieramy tylko posty dla danej strony
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Zwracamy posty oraz informacje o paginacji
    res.json({
      posts,
      totalPages,
      currentPage: page,
    });

  } catch (err) {
    console.error('Błąd przy pobieraniu postów z paginacją:', err);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów.' });
  }
};

// --- Pozostałe funkcje bez zmian, ale zoptymalizowane i wyczyszczone ---
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

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  const newPost = new Post({ title, content, images });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta.' });
    }

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