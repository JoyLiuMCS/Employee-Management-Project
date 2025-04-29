const multer = require('multer');
const OnboardingApplication = require('../models/OnboardingApplication');

// ⭐️ 设置 Multer 来处理 multipart/form-data （但这里只拿字段，不上传文件）
const upload = multer({ storage: multer.memoryStorage() });

// ⭐️ 查询onboarding状态
const getOnboardingStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const application = await OnboardingApplication.findOne({ userId });

    if (!application) {
      return res.json({ status: 'never_submitted' });
    }

    return res.json({ status: application.status });  // pending, approved, rejected
  } catch (err) {
    next(err);
  }
};

// ⭐️ 提交onboarding申请
const submitApplication = [
  upload.none(),  // ⭐️ 这行必须加上，告诉multer即使是multipart，也解析字段
  async (req, res, next) => {
    try {
      const { visaType, workAuthorizationStart, workAuthorizationEnd, optReceipt, optEAD, i983, i20 } = req.body;

      const newApp = new OnboardingApplication({
        userId: req.user.userId,
        visaType,
        workAuthorizationStart,
        workAuthorizationEnd,
        optReceipt,
        optEAD,
        i983,
        i20,
        status: 'pending',
      });

      await newApp.save();
      res.status(201).json({ message: 'Application submitted successfully' });
    } catch (err) {
      next(err);
    }
  }
];

module.exports = { 
  submitApplication,
  getOnboardingStatus
};
