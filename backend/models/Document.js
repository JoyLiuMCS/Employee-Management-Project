// backend/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 关联到User
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // 上传后默认是pending
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
