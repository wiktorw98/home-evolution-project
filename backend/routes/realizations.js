// backend/routes/realizations.js
const express = require('express');
const router = express.Router();
const realizationController = require('../controllers/realizationController');
const upload = require('../middleware/upload'); // Używamy naszego reużywalnego middleware

router.get('/', realizationController.getAllRealizations);
router.get('/:id', realizationController.getRealizationById); // NOWA TRASA
router.post('/', upload.single('image'), realizationController.createRealization);
router.put('/:id', upload.single('image'), realizationController.updateRealization); // NOWA TRASA
router.delete('/:id', realizationController.deleteRealization);

module.exports = router;