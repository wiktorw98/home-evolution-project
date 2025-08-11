// backend/controllers/postController.js
const Post = require('../models/Post');
const fs = require('fs');

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ posts, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów.' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Nie znaleziono posta.' });
    res.json(post);
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];
  const newPost = new Post({ title, content, images });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    if (images.length > 0) images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    res.status(400).json({ message: 'Błąd walidacji.' });
  }
};

// NOWA FUNKCJA
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    let { existingImages } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Nie znaleziono posta.' });

    if (typeof existingImages === 'string') existingImages = [existingImages];
    if (!existingImages) existingImages = [];

    const imagesToDelete = post.images.filter(img => !existingImages.includes(img));
    imagesToDelete.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));

    const newImagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];
    
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
    if (post.images && post.images.length > 0) {
      post.images.forEach(path => fs.unlink(path, e => { if (e) console.error(e); }));
    }
    await post.deleteOne();
    res.json({ message: 'Post został usunięty.' });
  } catch (err) { res.status(500).json({ message: 'Błąd serwera.' }); }
};