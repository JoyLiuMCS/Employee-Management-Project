const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { sendRegistrationEmail, getEmailHistory } = require('../controllers/emailController');

router.post('/send-registration-email', authMiddleware, authorizeRoles('hr'), sendRegistrationEmail);
router.get('/history', authMiddleware, authorizeRoles('hr'), getEmailHistory);

module.exports = router;
