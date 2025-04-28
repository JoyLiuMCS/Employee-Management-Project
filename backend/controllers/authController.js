// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }  
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }  // Refresh Token有效期7天
  );
};

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }

      const newUser = new User({ name, email, password, role });
      await newUser.save();

      res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: { id: user._id, name: user.name, role: user.role }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token missing' });

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Invalid refresh token', error: err.message });
    }
  }
};

module.exports = authController;
