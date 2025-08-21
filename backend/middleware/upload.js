const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const customStorage = {
  _handleFile: function (req, file, cb) {
    const transformer = sharp()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 });

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'home-evolution',
      },
      (error, result) => {
        if (error) {
          return cb(error);
        }
        cb(null, {
          path: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    file.stream.pipe(transformer).pipe(uploadStream);
  },

  _removeFile: function (req, file, cb) {
    cloudinary.uploader.destroy(file.public_id, (error, result) => {
      cb(error);
    });
  }
};

const upload = multer({ 
  storage: customStorage,
  limits: {
    fileSize: 1024 * 1024 * 15
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Dozwolone są tylko pliki graficzne!'), false);
    }
  }
});

module.exports = upload;