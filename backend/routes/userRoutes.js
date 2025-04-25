const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get all users
router.get('/users', userController.getAllUsers);

// Route to get a specific user by ID
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);

module.exports = router;
