// backend/models/FormSubmission.js
const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);