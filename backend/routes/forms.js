// backend/routes/forms.js
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Ta linia jest poprawna, pod warunkiem, że formController.js
// poprawnie eksportuje handleFormSubmission
router.post('/', formController.handleFormSubmission);

module.exports = router;