// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

const { approveApplication, rejectApplication, getPendingApplications, getAllApplications } = require('../controllers/applicationController');

// 获取所有申请（不做身份验证）
router.get('/', getAllApplications); // 新增获取所有申请的路由

// 只有 HR 才能审批
router.post('/:id/approve', authMiddleware, authorizeRoles('hr'), approveApplication);
router.post('/:id/reject', authMiddleware, authorizeRoles('hr'), rejectApplication);
router.get('/pending', authMiddleware, authorizeRoles('hr'), (req, res, next) => {
    console.log('Received request for pending applications');
    next();
  }, getPendingApplications);
  
module.exports = router;
