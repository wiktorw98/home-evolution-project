// backend/controllers/offerController.js
const Offer = require('../models/Offer');

// Pobierz wszystkie oferty
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};

// Zaktualizuj ofertę (znajdź po serviceId i zaktualizuj)
exports.updateOffer = async (req, res) => {
  const { title, description, benefits } = req.body;
  
  // Jeśli przesyłane jest nowe zdjęcie
  if (req.file) {
    // TODO: Usunięcie starego zdjęcia z serwera (fs.unlink)
    const imageUrl = req.file.path;
    try {
      const updatedOffer = await Offer.findOneAndUpdate(
        { serviceId: req.params.serviceId },
        { title, description, benefits, imageUrl },
        { new: true } // Zwróć zaktualizowany dokument
      );
      res.json(updatedOffer);
    } catch (err) {
      res.status(400).json({ message: 'Błąd aktualizacji.' });
    }
  } else { // Jeśli aktualizujemy tylko tekst
    try {
      const updatedOffer = await Offer.findOneAndUpdate(
        { serviceId: req.params.serviceId },
        { title, description, benefits },
        { new: true }
      );
      res.json(updatedOffer);
    } catch (err) {
      res.status(400).json({ message: 'Błąd aktualizacji.' });
    }
  }
};
// NOWA FUNKCJA DO TWORZENIA OFERTY
exports.createOffer = async (req, res) => {
  const { serviceId, title, description, benefits } = req.body;

  // Sprawdzamy, czy plik został wgrany
  if (!req.file) {
    return res.status(400).json({ message: 'Brak pliku obrazka.' });
  }

  // Sprawdzamy, czy oferta o takim serviceId już nie istnieje
  const existingOffer = await Offer.findOne({ serviceId });
  if (existingOffer) {
    return res.status(400).json({ message: 'Oferta o takim ID już istnieje.' });
  }

  const newOffer = new Offer({
    serviceId,
    title,
    description,
    benefits,
    imageUrl: req.file.path
  });

  try {
    const savedOffer = await newOffer.save();
    res.status(201).json(savedOffer); // 201 - Created
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};