const Document = require('../models/Document');

const uploadDocument = async (req, res) => {
  try {
    const newDoc = new Document({
      userId: req.user.userId,
      docType: req.body.docType,
      filePath: req.file.path,
    });
    await newDoc.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadDocument };
