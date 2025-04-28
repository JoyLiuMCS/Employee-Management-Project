// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { sendRegistrationEmail } = require('../controllers/emailController');

// 只有 HR 可以发注册邮件
router.post('/send-registration-email', authMiddleware, authorizeRoles('hr'), sendRegistrationEmail);

module.exports = router;
