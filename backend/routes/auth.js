// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// === NOWA KONFIGURACJA: LIMIT PRÓB LOGOWANIA ===
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Okno czasowe: 15 minut
  max: 5, // Maksymalna liczba prób z jednego IP w tym oknie czasowym
  message: {
    message: 'Zbyt wiele prób logowania z tego adresu IP. Spróbuj ponownie za 15 minut.'
  },
  standardHeaders: true, // Wysyłaj standardowe nagłówki 'RateLimit-*'
  legacyHeaders: false, // Nie wysyłaj starych nagłówków 'X-RateLimit-*'
});

// ZMIANA: Stosujemy nasz limiter TYLKO do trasy logowania
// POST /api/auth/login -> Logowanie użytkownika
router.post('/login', loginLimiter, authController.login);

module.exports = router;