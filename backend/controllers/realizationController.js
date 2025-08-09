// backend/controllers/realizationController.js

const Realization = require('../models/Realization');

// --- Pobieranie wszystkich realizacji ---
exports.getAllRealizations = async (req, res) => {
  try {
    const realizations = await Realization.find().sort({ createdAt: -1 });
    res.json(realizations);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu realizacji.' });
  }
};

// --- Tworzenie nowej realizacji ---
exports.createRealization = async (req, res) => {
  const { title, description, category } = req.body;
  
  // Sprawdzamy, czy plik został wgrany
  if (!req.file) {
    return res.status(400).json({ message: 'Brak pliku obrazka.' });
  }

  const newRealization = new Realization({
    title,
    description,
    category,
    imageUrl: req.file.path // Zapisujemy ścieżkę do wgranego pliku
  });

  try {
    const savedRealization = await newRealization.save();
    res.status(201).json(savedRealization);
  } catch (err) {
    res.status(400).json({ message: 'Błąd walidacji. Sprawdź dane.' });
  }
};

// --- Usuwanie realizacji ---
exports.deleteRealization = async (req, res) => {
  try {
    const realization = await Realization.findById(req.params.id);
    if (!realization) {
      return res.status(404).json({ message: 'Nie znaleziono realizacji.' });
    }
    
    // TODO: Warto by było też usunąć plik z serwera (fs.unlink)
    // Na razie dla uproszczenia zostawiamy plik na serwerze

    await realization.deleteOne();
    res.json({ message: 'Realizacja została usunięta.' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera przy usuwaniu realizacji.' });
  }
};