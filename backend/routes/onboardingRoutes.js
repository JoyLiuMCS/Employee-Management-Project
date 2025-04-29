const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { submitApplication, getOnboardingStatus } = require('../controllers/appController');
const multer = require('multer');

// ⭐ 设置内存存储，能接收文件（而不是.none()）
const upload = multer({ storage: multer.memoryStorage() });

// ⭐ 改这里，不是 upload.none()！
router.post('/submit', authMiddleware, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'driversLicense', maxCount: 1 },
  { name: 'workAuthorization', maxCount: 1 }
]), submitApplication);

router.get('/status', authMiddleware, getOnboardingStatus);

module.exports = router;
