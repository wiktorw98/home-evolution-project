// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Pobierz token z nagłówka
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Sprawdź, czy token istnieje
  if (!token) {
    return res.status(401).json({ message: 'Brak autoryzacji, token nie został dostarczony.' });
  }

  // Zweryfikuj token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Dołącz dane użytkownika do obiektu req
    next(); // Przejdź do następnej funkcji
  } catch (err) {
    res.status(401).json({ message: 'Token jest nieprawidłowy.' });
  }
};