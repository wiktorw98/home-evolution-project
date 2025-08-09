// backend/routes/forms.js
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/', formController.handleFormSubmission);

module.exports = router;