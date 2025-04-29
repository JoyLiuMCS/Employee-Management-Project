// controllers/applicationController.js
const OnboardingApplication = require('../models/OnboardingApplication');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const getAllApplications = async (req, res, next) => {
  try {
    const allApplications = await OnboardingApplication.find().populate('userId', 'name email');
    res.status(200).json(allApplications);
  } catch (err) {
    next(err);
  }
};

const getPendingApplications = async (req, res, next) => {
  try {
    const pendingApplications = await OnboardingApplication.find({ status: 'pending' }).populate('userId', 'name email');
    res.status(200).json(pendingApplications);
  } catch (err) {
    next(err);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await OnboardingApplication.findById(req.params.id).populate('userId', 'name email');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
};

const approveApplication = async (req, res, next) => {
  try {
    const appId = req.params.id;
    const application = await OnboardingApplication.findById(appId).populate('userId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'approved';
    await application.save();

    await sendEmail(application.userId.email, 'Application Approved', 'Your application has been approved.');
    res.status(200).json({ message: 'Application approved' });
  } catch (err) {
    next(err);
  }
};

const rejectApplication = async (req, res, next) => {
  try {
    const appId = req.params.id;
    const { rejectionReason } = req.body; 

    const application = await OnboardingApplication.findById(appId).populate('userId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    application.rejectionReason = rejectionReason || 'No reason provided';
    await application.save();

    await sendEmail(application.userId.email, 'Application Rejected', `Your application was rejected. Reason: ${rejectionReason}`);
    res.status(200).json({ message: 'Application rejected' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllApplications,
  getPendingApplications,
  getApplicationById,
  approveApplication,
  rejectApplication
};
