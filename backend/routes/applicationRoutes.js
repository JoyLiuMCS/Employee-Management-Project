// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { 
  approveApplication, 
  rejectApplication, 
  getPendingApplications, 
  getAllApplications, 
  getApplicationById    // ⭐️ 加这一行
} = require('../controllers/applicationController');

// 获取所有申请（不做身份验证）
router.get('/', getAllApplications);

// 获取单个申请（需要HR）
router.get('/:id', authMiddleware, authorizeRoles('hr'), getApplicationById);

// 获取pending申请列表（需要HR）
router.get('/pending', authMiddleware, authorizeRoles('hr'), getPendingApplications);

// HR审批/拒绝申请
router.post('/:id/approve', authMiddleware, authorizeRoles('hr'), approveApplication);
router.post('/:id/reject', authMiddleware, authorizeRoles('hr'), rejectApplication);

module.exports = router;
