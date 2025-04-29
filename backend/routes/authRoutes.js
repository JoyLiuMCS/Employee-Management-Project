// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, registerWithToken, login, refresh } = require('../controllers/authController');

router.post('/register/:token', registerWithToken);

router.post('/register', register);

router.post('/login', login);
router.post('/refresh', refresh);

module.exports = router;
