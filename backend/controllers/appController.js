const OnboardingApplication = require('../models/OnboardingApplication');

const submitApplication = async (req, res, next) => {
  try {
    const { visaType, workAuthorizationStart, workAuthorizationEnd, optReceipt, optEAD, i983, i20 } = req.body;
    const newApp = new OnboardingApplication({
      userId: req.user.userId,  // Requires auth middleware to set req.user
      visaType,
      workAuthorizationStart,
      workAuthorizationEnd,
      optReceipt,
      optEAD,
      i983,
      i20
    });
    await newApp.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitApplication };