// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const documentController = require('../controllers/documentController');

router.post('/upload', 
  authMiddleware, 
  authorizeRoles('employee'), 
  upload.single('file'), 
  documentController.uploadDocument
);

module.exports = router;