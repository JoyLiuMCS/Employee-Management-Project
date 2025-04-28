// controllers/applicationController.js
const OnboardingApplication = require('../models/OnboardingApplication');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');  // 下面我们也会写 emailService.js

const getAllApplications = async (req, res) => {
    try {
      const allApplications = await OnboardingApplication.find().populate('userId', 'name email');
  
      res.status(200).json({ success: true, applications: allApplications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

const getPendingApplications = async (req, res) => {
    try {
      const pendingApplications = await OnboardingApplication.find({ status: 'pending' }).populate('userId', 'name email');
  
      res.status(200).json({ success: true, applications: pendingApplications });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

// HR审批通过
const approveApplication = async (req, res) => {
  try {
    const appId = req.params.id;
    const application = await OnboardingApplication.findById(appId).populate('userId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = 'approved'; // 需要在model里加个status字段
    await application.save();

    // 给用户发邮件通知
    await sendEmail(application.userId.email, 'Application Approved', 'Congratulations! Your application has been approved.');

    res.status(200).json({ success: true, message: 'Application approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// HR拒绝申请
const rejectApplication = async (req, res) => {
  try {
    const appId = req.params.id;
    const { reason } = req.body; // 拒绝理由

    const application = await OnboardingApplication.findById(appId).populate('userId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = 'rejected';
    application.rejectionReason = reason;
    await application.save();

    // 给用户发邮件通知
    await sendEmail(application.userId.email, 'Application Rejected', `Unfortunately, your application was rejected. Reason: ${reason}`);

    res.status(200).json({ success: true, message: 'Application rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { approveApplication, rejectApplication, getPendingApplications, getAllApplications };
