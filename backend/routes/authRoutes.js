const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (no auth required)
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public (use refreshToken)
router.post('/refresh', refresh);

module.exports = router;
