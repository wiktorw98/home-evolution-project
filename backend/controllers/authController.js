// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  // --- PUNKT KONTROLNY 1: Co dokładnie dotarło do serwera? ---
  console.log('--- Otrzymano próbę logowania ---');
  console.log('Otrzymane dane (req.body):', req.body);

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    // --- PUNKT KONTROLNY 2: Czy znaleziono użytkownika w bazie? ---
    if (!user) {
      console.log(`Wynik wyszukiwania dla username="${username}": NIE ZNALEZIONO`);
      return res.status(401).json({ message: 'Błędna nazwa użytkownika lub hasło' });
    }
    console.log(`Wynik wyszukiwania dla username="${username}": ZNALEZIONO UŻYTKOWNIKA. ID: ${user.id}`);
    
    // --- PUNKT KONTROLNY 3: Porównujemy hasła ---
    console.log('Rozpoczynam porównywanie haseł...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Wynik porównywania haseł: NIEPOPRAWNE');
      return res.status(401).json({ message: 'Błędna nazwa użytkownika lub hasło' });
    }
    console.log('Wynik porównywania haseł: POPRAWNE. Generuję token...');

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
      (err, token) => {
        if (err) throw err;
        console.log('--- Logowanie zakończone sukcesem ---');
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('--- KRYTYCZNY BŁĄD W KONTROLERZE LOGOWANIA ---', err);
    res.status(500).send('Błąd serwera');
  }
};