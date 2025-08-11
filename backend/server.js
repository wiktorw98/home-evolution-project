// backend/server.js

// KROK 1: Ładujemy zmienne środowiskowe jako absolutny priorytet
require('dotenv').config();

// KROK 2: Importujemy wszystkie potrzebne biblioteki i moduły
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Importujemy nasze modele
const User = require('./models/User');
const Offer = require('./models/Offer');

// Importujemy nasze trasy
const postRoutes = require('./routes/posts');
const realizationRoutes = require('./routes/realizations');
const formRoutes = require('./routes/forms');
const offerRoutes = require('./routes/offers');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// KROK 3: Inicjalizujemy aplikację Express
const app = express();

// KROK 4: Konfigurujemy Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// KROK 5: Podłączamy nasze trasy API
app.use('/api/posts', postRoutes);
app.use('/api/realizations', realizationRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// --- Funkcja do jednorazowego stworzenia konta admina ---
const initializeAdmin = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Brak użytkowników w bazie. Tworzę domyślne konto admina...');
      
      const username = 'admin';
      const password = 'admin';
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const adminUser = new User({
        username,
        password: hashedPassword,
      });

      await adminUser.save();
      console.log(`Stworzono konto admina: login - ${username}, hasło - ${password}`);
    }
  } catch (error) {
    console.error('Błąd podczas inicjalizacji konta admina:', error);
  }
};

// --- Funkcja inicjalizująca oferty ---
const initializeOffers = async () => {
  try {
    const count = await Offer.countDocuments();
    if (count === 0) {
      console.log('Baza danych ofert jest pusta. Inicjalizuję dane startowe...');
      const initialData = [
        { 
          serviceId: "fotowoltaika", 
          title: "Panele Fotowoltaiczne", 
          description: "Inwestycja w fotowoltaikę to krok w stronę niezależności energetycznej i znacznych oszczędności. Produkuj własny, darmowy prąd ze słońca, dbając jednocześnie o środowisko.",
          benefits: [
            "Obniżenie rachunków za prąd nawet o 90%",
            "Niezależność od podwyżek cen energii",
            "Zwiększenie wartości nieruchomości",
            "Rozwiązanie ekologiczne i bezobsługowe"
          ], 
          // Upewniamy się, że ścieżka jest poprawna
          imageUrl: "uploads/oferta-fotowoltaika.jpg" 
        },
        { 
          serviceId: "ocieplenie", 
          title: "Ocieplenie i Termomodernizacja", 
          description: "Prawidłowo wykonana termoizolacja budynku to klucz do komfortu cieplnego przez cały rok i niższych kosztów ogrzewania. Używamy tylko sprawdzonych materiałów, gwarantując najwyższą jakość.",
          benefits: [
            "Redukcja strat ciepła zimą do 30%",
            "Ochrona przed upałami latem",
            "Poprawa estetyki i odświeżenie elewacji",
            "Zabezpieczenie konstrukcji budynku"
          ], 
          imageUrl: "uploads/oferta-ocieplenie.jpg"
        },
        { 
          serviceId: "kotly", 
          title: "Wymiana Źródeł Ciepła", 
          description: "Wymień stary, nieefektywny kocioł na nowoczesne, ekologiczne źródło ciepła. Oferujemy kompleksowe doradztwo i montaż pomp ciepła, kotłów gazowych oraz kotłów na pellet.",
          benefits: [
            "Znaczne obniżenie kosztów ogrzewania",
            "Spełnienie norm ekologicznych i uniknięcie kar",
            "Wygoda i bezpieczeństwo użytkowania",
            "Możliwość uzyskania dofinansowania"
          ], 
          imageUrl: "uploads/oferta-kotly.jpg"
        }
      ];
      await Offer.insertMany(initialData);
      console.log('Dane startowe dla ofert zostały pomyślnie dodane.');
    }
  } catch (error) {
    console.error('Błąd podczas inicjalizacji danych ofert:', error);
  }
};


// --- Połączenie z Bazą Danych i Uruchomienie Serwera ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Połączono z MongoDB!');
    app.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
      initializeOffers(); 
      initializeAdmin();
    });
  })
  .catch(err => {
    console.error('Krytyczny błąd połączenia z MongoDB:', err);
    process.exit(1);
  });