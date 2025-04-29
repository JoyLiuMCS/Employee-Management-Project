const OnboardingApplication = require('../models/OnboardingApplication');
const User = require('../models/User');
const Document = require('../models/Document');
const path = require('path');

const getOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const application = await OnboardingApplication.findOne({ userId });
    if (!application) return res.json({ status: 'never_submitted' });
    return res.json({ status: application.status });
  } catch (err) {
    next(err);
  }
};

const submitApplication = async (req, res, next) => {
  try {
    const parseBool = (val) => val === 'true' || val === true;

    const {
      visaType,
      workAuthorizationStart,
      workAuthorizationEnd,
      optReceipt,
      optEAD,
      i983,
      i20,
      phoneNumber,
      workPhone,
      address,
    } = req.body;

    const userId = req.user.userId;
    const uploadedDocs = [];

    // 🔥 存储文件信息到 Document 表
    const files = req.files || {};
    const fileFields = ['profilePicture', 'driversLicense', 'workAuthorization'];

    for (const field of fileFields) {
      if (files[field]?.[0]) {
        const file = files[field][0];
        const newDoc = new Document({
          userId,
          filename: file.filename,
          fileUrl: `/uploads/${file.filename}`,
          status: 'pending',
        });
        await newDoc.save();
        uploadedDocs.push(newDoc._id);
      }
    }

    // 创建 OnboardingApplication 文档
    const newApp = new OnboardingApplication({
      userId,
      visaType,
      workAuthorizationStart,
      workAuthorizationEnd,
      optReceipt: parseBool(optReceipt),
      optEAD: parseBool(optEAD),
      i983: parseBool(i983),
      i20: parseBool(i20),
      documents: uploadedDocs,
    });
    await newApp.save();

    // 🔁 同步更新 User 表
    const user = await User.findById(userId);
    if (user) {
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.workPhone = workPhone || user.workPhone;
      if (address) {
        user.address = {
          ...user.address,
          ...address,
        };
      }
      await user.save();
    }

    res.status(201).json({ message: 'Onboarding submitted and user updated successfully.' });
  } catch (err) {
    console.error('❌ Onboarding submit error:', err);
    next(err);
  }
};

module.exports = {
  submitApplication,
  getOnboardingStatus,
};
