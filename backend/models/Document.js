const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 🔥 关联到User模型
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // 上传默认是pending
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now, // 自动记录上传时间
  },
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
