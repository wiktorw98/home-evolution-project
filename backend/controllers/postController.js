// backend/controllers/postController.js
const Post = require('../models/Post');
const fs = require('fs');

exports.getAllPosts = async (req, res) => { /* ... (logika paginacji bez zmian) ... */ };
exports.getPostById = async (req, res) => { /* ... (bez zmian) ... */ };

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];
  const newPost = new Post({ title, content, images });
  try {
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    if (images.length > 0) images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    res.status(400).json({ message: 'Błąd walidacji.' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Nie znaleziono posta.' });
    if (post.images && post.images.length > 0) {
      post.images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    }
    await post.deleteOne();
    res.json({ message: 'Post został usunięty.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};