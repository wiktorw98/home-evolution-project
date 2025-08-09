// backend/server.js

// Importowanie bibliotek
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Ładuje zmienne z pliku .env

// Inicjalizacja aplikacji Express
const app = express();

// --- Middleware (funkcje pośredniczące) ---
app.use(cors()); // Umożliwia zapytania z innych domen (naszego frontendu)
app.use(express.json()); // Pozwala serwerowi rozumieć dane w formacie JSON

// Udostępnianie folderu z wgranymi zdjęciami
// Dzięki temu frontend będzie mógł wyświetlać zdjęcia
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


// --- Definicje Ścieżek (Routes) ---
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const realizationRoutes = require('./routes/realizations');
app.use('/api/realizations', realizationRoutes);

const formRoutes = require('./routes/forms');
app.use('/api/forms', formRoutes);

// NOWA ŚCIEŻKA DLA OFERT
const offerRoutes = require('./routes/offers');
app.use('/api/offers', offerRoutes);


// --- Połączenie z Bazą Danych MongoDB ---
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Połączono z MongoDB!');
  // Po udanym połączeniu, uruchom funkcję inicjalizującą dane dla ofert
  initializeOffers(); 
})
.catch(err => console.error('Błąd połączenia z MongoDB:', err));


// --- Funkcja do jednorazowego dodania danych ofert do bazy ---
// Ta funkcja sprawdzi, czy w bazie są już oferty. Jeśli nie, doda je.
const Offer = require('./models/Offer'); // Upewnij się, że masz plik models/Offer.js

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
          imageUrl: "uploads/oferta-fotowoltaika.jpg" // Upewnij się, że masz ten plik w /uploads
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
          imageUrl: "uploads/oferta-ocieplenie.jpg" // Upewnij się, że masz ten plik w /uploads
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
          imageUrl: "uploads/oferta-kotly.jpg" // Upewnij się, że masz ten plik w /uploads
        }
      ];
      
      await Offer.insertMany(initialData);
      console.log('Dane startowe dla ofert zostały pomyślnie dodane.');
    }
  } catch (error) {
    console.error('Błąd podczas inicjalizacji danych ofert:', error);
  }
};


// --- Uruchomienie Serwera ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});