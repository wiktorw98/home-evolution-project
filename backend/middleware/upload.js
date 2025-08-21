// backend/middleware/upload.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfiguracja Cloudinary przy użyciu zmiennych środowiskowych
// To jest bezpieczny sposób na przechowywanie Twoich kluczy API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfiguracja silnika przechowywania dla Multer, który wysyła pliki do Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Określamy folder na Cloudinary, gdzie będą trzymane pliki
    folder: 'home-evolution', 
    // Ustalamy dozwolone formaty - Cloudinary sam odrzuci inne pliki
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // OPTYMALIZACJA: Możemy dodać transformację, która wykona się przy uploadzie
    // Poniższa reguła ograniczy szerokość obrazu do 1920px i ustawi jakość na auto,
    // co znacząco zmniejszy wagę pliku bez widocznej straty jakości.
    transformation: [{ width: 1920, quality: 'auto' }]
  }
});

// Tworzymy middleware Multer z nowym silnikiem `storage`
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // Zwiększamy limit do 10MB, Cloudinary i tak zoptymalizuje plik
  },
});

module.exports = upload;