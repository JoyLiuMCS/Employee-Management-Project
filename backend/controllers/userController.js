// backend/controllers/userController.js

const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  // 🔥 Correct: Update user safely
  async updateUser(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // ✅ 更新顶层字段
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.middleName = req.body.middleName || user.middleName;
      user.preferredName = req.body.preferredName || user.preferredName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.workPhone = req.body.workPhone || user.workPhone;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.ssn = req.body.ssn || user.ssn;

      // ✅ 更新 address（嵌套字段）
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }

      // ✅ 更新 visa信息（如果有）
      if (req.body.citizenshipStatus) {
        user.citizenshipStatus = req.body.citizenshipStatus;
        user.visaTitle = req.body.visaTitle || user.visaTitle;
        user.visaStartDate = req.body.visaStartDate || user.visaStartDate;
        user.visaEndDate = req.body.visaEndDate || user.visaEndDate;
        user.otherVisaTitle = req.body.otherVisaTitle || user.otherVisaTitle;
      }

      // ✅ 更新 emergencyContacts（如果有）
      if (req.body.emergencyContacts) {
        user.emergencyContacts = req.body.emergencyContacts;
      }

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('❌ Error updating user:', err);
      next(err);
    }
  },
};

module.exports = userController;
