// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');
const { downloadDocument, uploadDocument, getInProgressDocuments, approveDocument, rejectDocument } = require('../controllers/documentController');
const { getMyDocuments } = require('../controllers/documentController');

router.post('/upload', authMiddleware, authorizeRoles('employee'), upload.single('file'), uploadDocument);
router.get('/in-progress', authMiddleware, authorizeRoles('hr'), getInProgressDocuments);
router.post('/approve/:id', authMiddleware, authorizeRoles('hr'), approveDocument);
router.post('/reject/:id', authMiddleware, authorizeRoles('hr'), rejectDocument);
router.get('/my', authMiddleware, authorizeRoles('employee', 'hr'), getMyDocuments);
router.get('/download/:filename', 
    authMiddleware, 
    downloadDocument);


module.exports = router;