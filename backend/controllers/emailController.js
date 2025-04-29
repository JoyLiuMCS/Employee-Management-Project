const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EmailHistory = require('../models/EmailHistory'); // ⭐️ 需要新建 EmailHistory model
require('dotenv').config();

const sendRegistrationEmail = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // 生成注册 token，设置3小时过期
    const registrationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });

    // 构建注册链接
    const registrationLink = `http://localhost:5173/register?token=${registrationToken}`;

    // 配置 nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
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
      html: `<p>Please click <a href="${registrationLink}">here</a> to complete your registration. Link expires in 3 hours.</p>`,
    });

    // ⭐️ 保存发送记录
    await EmailHistory.create({
      email,
      name: name || '',  // 有名字就记录，没有也不报错
      token: registrationToken,
      status: 'pending',
    });

    res.status(200).json({ message: 'Registration email sent successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 新增的接口：查看发过的邮件记录
const getEmailHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch email history' });
  }
};

module.exports = { sendRegistrationEmail, getEmailHistory };
