const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitApplication, getOnboardingStatus } = require('../controllers/appController');

router.post('/submit', authMiddleware, submitApplication);

router.get('/status', authMiddleware, getOnboardingStatus);

module.exports = router;
