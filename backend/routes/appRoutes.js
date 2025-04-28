const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitApplication } = require('../controllers/appController');

// Protected route with authentication
router.post('/submitApp', authMiddleware, submitApplication);

module.exports = router;