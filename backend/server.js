// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
// ZMIANA: Usunięto import Offer

const postRoutes = require('./routes/posts');
const realizationRoutes = require('./routes/realizations');
const formRoutes = require('./routes/forms');
// ZMIANA: Usunięto import offerRoutes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/posts', postRoutes);
app.use('/api/realizations', realizationRoutes);
app.use('/api/forms', formRoutes);
// ZMIANA: Usunięto trasę /api/offers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const initializeAdmin = async () => { /* ... (funkcja bez zmian) ... */ };
// ZMIANA: Całkowicie usunięto funkcję initializeOffers

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Połączono z MongoDB!');
    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
      // ZMIANA: Usunięto wywołanie initializeOffers()
      initializeAdmin();
    });
  })
  .catch(err => { console.error('Krytyczny błąd połączenia z MongoDB:', err); process.exit(1); });