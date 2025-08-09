// backend/controllers/postController.js

const Post = require('../models/Post');

// --- Pobieranie wszystkich postów ---
exports.getAllPosts = async (req, res) => {
  try {
    // Sortujemy posty od najnowszych (-1) do najstarszych
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu postów.' });
  }
};

// --- Tworzenie nowego posta ---
exports.createPost = async (req, res) => {
  // Pobieramy dane z ciała żądania (wysłane z formularza w panelu admina)
  const { title, content, imageUrl } = req.body;

  const newPost = new Post({
    title,
    content,
    imageUrl
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost); // 201 - status "Created"
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

// --- Usuwanie posta ---
exports.deletePost = async (req, res) => {
  try {
    // Szukamy posta po ID, które jest w adresie URL (np. /api/posts/12345)
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Nie znaleziono posta.' });
    }

    await post.deleteOne(); // Używamy deleteOne() na znalezionym dokumencie
    res.json({ message: 'Post został usunięty.' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy usuwaniu posta.' });
  }
};