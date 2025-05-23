// backend/controllers/emailController.js

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EmailHistory = require('../models/EmailHistory');
require('dotenv').config();

const sendRegistrationEmail = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const registrationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const registrationLink = `${frontendURL}/register/${registrationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Complete your registration',
      html: `<p>Please click <a href="${registrationLink}">here</a> to complete your registration. Link expires in 3 hours.</p>`,
    });

    await EmailHistory.create({
      email,
      name: name || '',
      token: registrationToken,
      status: 'pending',
    });

    res.status(200).json({ message: 'Registration email sent successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

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
