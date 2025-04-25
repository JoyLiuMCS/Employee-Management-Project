const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { uploadDocument } = require('../controllers/documentController');

router.post('/upload', auth, upload.single('file'), uploadDocument);

module.exports = router;
