const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// 🔥 新增 PATCH /api/users/:id
router.patch('/:id', userController.updateUser);

module.exports = router;
