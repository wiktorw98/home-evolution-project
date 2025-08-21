const mongoose = require('mongoose');

const realizationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  images: {
    type: [String],
    required: true,
    validate: [val => val.length > 0, 'Należy wgrać co najmniej jedno zdjęcie.']
  },
  category: { 
    type: [String], 
    required: true,
    validate: [val => val.length > 0, 'Należy wybrać co najmniej jedną kategorię.']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

realizationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Realization', realizationSchema);