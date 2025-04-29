const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users   →  getAllUsers
router.get('/users', userController.getAllUsers);

// GET /api/users/:id   →  getUserById
router.get('/:id', userController.getUserById);

module.exports = router;
