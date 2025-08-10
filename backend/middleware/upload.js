// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Konfiguracja przechowywania plików
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Określamy folder, do którego będą zapisywane pliki
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Tworzymy unikalną nazwę pliku, aby uniknąć konfliktów
    // np. nazwapliku-16254321.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtr plików, aby akceptować tylko obrazy
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Dozwolone są tylko pliki JPG i PNG!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit rozmiaru pliku na 5MB
  },
  fileFilter: fileFilter
});

// Eksportujemy skonfigurowany middleware
module.exports = upload;