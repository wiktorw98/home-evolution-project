// backend/routes/realizations.js
const express = require('express');
const router = express.Router();
const realizationController = require('../controllers/realizationController');
const upload = require('../middleware/upload');

router.get('/', realizationController.getAllRealizations);
router.get('/:id', realizationController.getRealizationById);
// ZMIANA: Używamy .array() do obsługi wielu plików
router.post('/', upload.array('images', 10), realizationController.createRealization);
router.put('/:id', upload.array('images', 10), realizationController.updateRealization);
router.delete('/:id', realizationController.deleteRealization);

module.exports = router;