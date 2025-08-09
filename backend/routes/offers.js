// backend/routes/offers.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

// Konfiguracja Multer do obsługi uploadu (taka sama jak dla realizacji)
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// GET /api/offers -> Pobierz wszystkie oferty
router.get('/', offerController.getAllOffers);

// PUT /api/offers/:serviceId -> Zaktualizuj ofertę (z opcjonalnym zdjęciem)
router.put('/:serviceId', upload.single('image'), offerController.updateOffer);

// POST /api/offers -> Stwórz nową ofertę
router.post('/', upload.single('image'), offerController.createOffer);


module.exports = router;