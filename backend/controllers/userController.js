// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // ID użytkownika pobrane z tokenu przez naszego strażnika

  try {
    // 1. Znajdź użytkownika w bazie
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
    }

    // 2. Sprawdź, czy stare hasło się zgadza
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Stare hasło jest nieprawidłowe.' });
    }

    // 3. Zaszyfruj i zapisz nowe hasło
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Hasło zostało pomyślnie zmienione.' });

  } catch (err) {
    console.error('Błąd przy zmianie hasła:', err);
    res.status(500).json({ message: 'Błąd serwera.' });
  }
};