// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, registerWithToken, login, refresh } = require('../controllers/authController');

// 🔥 新增：员工通过注册token注册
router.post('/register/:token', registerWithToken);

// 原来的register（如果以后有admin手动添加）
router.post('/register', register);

router.post('/login', login);
router.post('/refresh', refresh);

module.exports = router;
