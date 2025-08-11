// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // Importujemy naszego strażnika

// PUT /api/users/change-password -> Zmień hasło zalogowanego użytkownika
// Najpierw sprawdzamy token (authMiddleware), potem wykonujemy logikę (userController)
router.put('/change-password', authMiddleware, userController.changePassword);

module.exports = router;