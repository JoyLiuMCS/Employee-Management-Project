// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  docType: { type: String, required: true }, // e.g., passport, i20, opt receipt, etc.
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isApproved: { type: Boolean, default: false }, 
  feedback: { type: String, default: '' },       
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
