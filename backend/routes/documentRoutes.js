// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { downloadDocument, uploadDocument, getInProgressDocuments, approveDocument, rejectDocument } = require('../controllers/documentController');

router.post('/upload', authMiddleware, authorizeRoles('employee'), upload.single('file'), uploadDocument);
router.get('/download/:filename', 
    authMiddleware, 
    downloadDocument);


module.exports = router;