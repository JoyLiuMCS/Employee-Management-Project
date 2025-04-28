// controllers/emailController.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendRegistrationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // 生成注册token
    const registrationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3d' });

    // 构建注册链接
    const registrationLink = `http://your-frontend-domain.com/register?token=${registrationToken}`;

    // 配置nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // 你也可以换成SMTP设置
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 发送邮件
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Complete your registration',
      html: `<p>Please click <a href="${registrationLink}">here</a> to complete your registration.</p>`,
    });

    res.status(200).json({ message: 'Registration email sent successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendRegistrationEmail };
