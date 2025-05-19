const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  originalName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['profile_picture', 'drivers_license', 'general_work_auth', 'opt_receipt', 'opt_ead', 'i_983', 'i_20'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
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

