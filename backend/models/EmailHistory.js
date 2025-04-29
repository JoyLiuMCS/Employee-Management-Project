const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  token: { type: String },
  status: { type: String, enum: ['pending', 'submitted'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
