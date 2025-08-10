// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/upload'); // Zakładam, że masz ten plik z poprzednich kroków

// GET /api/posts -> Pobierz wszystkie posty
router.get('/', postController.getAllPosts);

// GET /api/posts/:id -> Pobierz jeden post po jego ID
router.get('/:id', postController.getPostById);

// ZMIANA: Używamy .array() zamiast .single()
// 'images' to nazwa pola w formularzu, a 10 to maksymalna liczba plików.
router.post('/', upload.array('images', 10), postController.createPost);

// DELETE /api/posts/:id -> Usuń post o konkretnym ID
router.delete('/:id', postController.deletePost);

module.exports = router;