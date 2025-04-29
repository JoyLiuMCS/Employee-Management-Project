const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitApplication, getOnboardingStatus } = require('../controllers/appController');

// 🔥 员工提交onboarding表单
router.post('/submit', authMiddleware, submitApplication);

// 🔥 员工获取自己的onboarding状态
router.get('/status', authMiddleware, getOnboardingStatus);

module.exports = router;
