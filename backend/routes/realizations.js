// backend/routes/realizations.js

const express = require('express');
const router = express.Router();
const realizationController = require('../controllers/realizationController');

// Potrzebujemy dostępu do naszej konfiguracji 'multer' z server.js
// Prostszym sposobem będzie ponowne skonfigurowanie go tutaj
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });


// GET /api/realizations -> Pobierz wszystkie realizacje
router.get('/', realizationController.getAllRealizations);

// POST /api/realizations -> Stwórz nową realizację, przechwytując jeden plik z pola 'image'
router.post('/', upload.single('image'), realizationController.createRealization);

// DELETE /api/realizations/:id -> Usuń realizację
router.delete('/:id', realizationController.deleteRealization);

module.exports = router;