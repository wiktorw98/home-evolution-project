// backend/routes/posts.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Definiujemy ścieżki i przypisujemy je do funkcji z kontrolera

// GET /api/posts -> Pobierz wszystkie posty
router.get('/', postController.getAllPosts);

// NOWA TRASA: GET /api/posts/:id -> Pobierz jeden post po jego ID
router.get('/:id', postController.getPostById);

// POST /api/posts -> Stwórz nowy post
router.post('/', postController.createPost);

// DELETE /api/posts/:id -> Usuń post o konkretnym ID
router.delete('/:id', postController.deletePost);

module.exports = router;