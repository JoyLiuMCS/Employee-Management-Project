// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { 
  approveApplication, 
  rejectApplication, 
  getPendingApplications, 
  getAllApplications, 
  getApplicationById    
} = require('../controllers/applicationController');

router.get('/', getAllApplications);

router.get('/:id', authMiddleware, authorizeRoles('hr'), getApplicationById);

router.get('/pending', authMiddleware, authorizeRoles('hr'), getPendingApplications);

router.post('/:id/approve', authMiddleware, authorizeRoles('hr'), approveApplication);
router.post('/:id/reject', authMiddleware, authorizeRoles('hr'), rejectApplication);

module.exports = router;
