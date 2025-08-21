const Post = require('../models/Post');
const fs = require('fs');

// Funkcja pomocnicza do tworzenia czystej zajawki
const createExcerpt = (htmlContent) => {
  if (!htmlContent) return '';
  const withSpaces = htmlContent.replace(/<\/h[1-6]>/g, ' ').replace(/<\/p>/g, ' ').replace(/<\/li>/g, ' ');
  const plainText = withSpaces.replace(/<[^>]*>/g, '');
  const normalizedText = plainText.replace(/\s+/g, ' ').trim();
  
  return normalizedText.length > 150 ? normalizedText.substring(0, 150) + '...' : normalizedText;
};

exports.getAllPosts = async (req, res) => {
  try {
    // OPTYMALIZACJA: Specjalna, lekka odpowiedź dla mapy strony
    if (req.query.forSitemap) {
      const posts = await Post.find({}).select('_id updatedAt');
      return res.json(posts);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const searchQuery = req.query.search;
    const skip = (page - 1) * limit;

    const query = {};
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' }; // Wyszukiwanie bez względu na wielkość liter
    }

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const postsFromDb = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const posts = postsFromDb.map(post => ({ ...post.toObject(), excerpt: createExcerpt(post.content) }));
    
    res.json({ posts, totalPages, currentPage: page });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
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