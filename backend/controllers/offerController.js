// backend/controllers/offerController.js
const Offer = require('../models/Offer');
const fs = require('fs');

// --- Pobieranie wszystkich ofert ---
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ _id: 1 }); // Sortujemy, aby zachować kolejność
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu ofert.' });
  }
};

// --- Tworzenie nowej oferty ---
exports.createOffer = async (req, res) => {
  const { serviceId, title, description, benefits } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Zdjęcie jest wymagane.' });
  }

  try {
    const existingOffer = await Offer.findOne({ serviceId });
    if (existingOffer) {
      // Jeśli oferta już istnieje, usuwamy nowo wgrany plik, bo nie będzie używany
      fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
      return res.status(400).json({ message: 'Oferta o takim ID już istnieje.' });
    }

    const newOffer = new Offer({
      serviceId,
      title,
      description,
      benefits,
      imageUrl: req.file.path
    });

    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer);
  } catch (err) {
    fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

// --- Aktualizacja istniejącej oferty ---
exports.updateOffer = async (req, res) => {
  try {
    const { title, description, benefits } = req.body;
    const offer = await Offer.findOne({ serviceId: req.params.serviceId });

    if (!offer) {
      // Jeśli nie znaleziono oferty, a wgrano plik, trzeba go usunąć
      if (req.file) fs.unlink(req.file.path, (err) => { if (err) console.error(err); });
      return res.status(404).json({ message: 'Nie znaleziono oferty.' });
    }

    // Aktualizujemy pola tekstowe
    offer.title = title;
    offer.description = description;
    offer.benefits = benefits;

    // Jeśli przesłano nowy plik, aktualizujemy ścieżkę i usuwamy stary plik
    if (req.file) {
      const oldImagePath = offer.imageUrl;
      offer.imageUrl = req.file.path;
      if (oldImagePath) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error(`Błąd przy usuwaniu starego pliku ${oldImagePath}:`, err);
        });
      }
    }

    const updatedOffer = await offer.save();
    res.json(updatedOffer);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy aktualizacji oferty.' });
  }
};