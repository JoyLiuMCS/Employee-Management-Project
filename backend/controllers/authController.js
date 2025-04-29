// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 生成 AccessToken
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

// 生成 RefreshToken
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const authController = {
  // ✅ HR后台直接添加用户（或旧版注册）
  async register(req, res, next) {
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
      next(err);
    }
  },

  // ✅ 员工通过注册链接注册
  async registerWithToken(req, res, next) {
    try {
      const { token } = req.params;
      const { username, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      if (!email) {
        return res.status(400).json({ success: false, message: 'Invalid registration token.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }

      const newUser = new User({
        email,
        name: username,
        password,
        role: 'employee',  // 新注册的一律是employee
      });

      await newUser.save();

      res.status(201).json({ success: true, message: 'Registration successful. Please login.' });
    } catch (err) {
      next(err);
    }
  },

  // ✅ 登录
  async login(req, res, next) {
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
      next(err);
    }
  },

  // ✅ 刷新Token
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token missing' });

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
