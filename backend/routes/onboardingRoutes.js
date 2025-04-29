const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitApplication, getOnboardingStatus } = require('../controllers/appController');
const upload = require('../middleware/upload');

router.post(
  '/submit',
  authMiddleware,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'driversLicense', maxCount: 1 },
    { name: 'workAuthorization', maxCount: 1 },
  ]),
  submitApplication
);

router.get('/status', authMiddleware, getOnboardingStatus);

module.exports = router;
