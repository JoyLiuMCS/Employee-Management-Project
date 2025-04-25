const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { submitApplication } = require('../controllers/appController');

router.post('/submit', auth, submitApplication);

module.exports = router;
