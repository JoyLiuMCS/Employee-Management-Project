const OnboardingApplication = require('../models/OnboardingApplication');
const User = require('../models/User');
const Document = require('../models/Document');
const path = require('path');

const getOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const application = await OnboardingApplication.findOne({ userId })
      .populate('documents');  // ✅ 关联文档
    if (!application) return res.json({ status: 'never_submitted' });
    return res.json(application);
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
      optEAD,
      i983,
      i20,
      phoneNumber,
      workPhone,
      address,
    } = req.body;

    const userId = req.user.userId;
    const uploadedDocs = [];
    const files = req.files || {};

    const fileFieldMap = {
      profilePicture: 'profile_picture',
      driversLicense: 'drivers_license',
      workAuthorization: 'general_work_auth',
      optReceipt: 'opt_receipt',
      optEAD: 'opt_ead',
      i983: 'i_983',
      i20: 'i_20'
    };
    
    let hasOptReceipt = false;  // 新增追踪

    for (const [field, type] of Object.entries(fileFieldMap)) {
      if (files[field]?.[0]) {
        const file = files[field][0];
        const newDoc = new Document({
          userId,
          filename: file.filename,
          originalName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
          type,
          status: 'pending',
        });
        await newDoc.save();
        uploadedDocs.push(newDoc._id);

        if (type === 'opt_receipt') {
          hasOptReceipt = true;
        }
      }
    }

    const newApp = new OnboardingApplication({
      userId,
      visaType,
      workAuthorizationStart,
      workAuthorizationEnd,
      optReceipt: hasOptReceipt || parseBool(req.body.optReceipt),  // ✅ 这里修复
      optEAD: parseBool(optEAD),
      i983: parseBool(i983),
      i20: parseBool(i20),
      documents: uploadedDocs,
    });
    await newApp.save();

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
    console.error('Submit error:', err);
    next(err);
  }
};


module.exports = {
  submitApplication,
  getOnboardingStatus,
};
