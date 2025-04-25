const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visaType: { type: String },
  workAuthorizationStart: { type: Date },
  workAuthorizationEnd: { type: Date },
  optReceipt: { type: Boolean },
  optEAD: { type: Boolean },
  i983: { type: Boolean },
  i20: { type: Boolean },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OnboardingApplication', onboardingSchema);
