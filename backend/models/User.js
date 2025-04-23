const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  preferredName: String,
  email: { type: String, required: true, unique: true },
  password: String,
  ssn: String,
  phone: String,
  workAuth: {
    title: String,
    startDate: Date,
    endDate: Date
  },
  role: { type: String, enum: ['employee', 'hr'], default: 'employee' },
  optEAD: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    feedback: String
  },
  i983: {
    uploadedDoc: String, // URL or filename
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    feedback: String
  },
  documents: [{
    name: String,
    type: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    fileUrl: String,
    feedback: String
  }],
  registrationToken: {
    token: String,
    expiresAt: Date,
    used: { type: Boolean, default: false }
  },
  onboardingApplication: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    data: mongoose.Schema.Types.Mixed,
    feedback: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
