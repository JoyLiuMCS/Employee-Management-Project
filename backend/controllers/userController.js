// backend/controllers/userController.js

const User = require('../models/User');

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  },

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

  async updateUser(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.middleName = req.body.middleName || user.middleName;
      user.preferredName = req.body.preferredName || user.preferredName;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.workPhone = req.body.workPhone || user.workPhone;
      user.gender = req.body.gender || user.gender;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.ssn = req.body.ssn || user.ssn;

      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }

      if (req.body.citizenshipStatus) {
        user.citizenshipStatus = req.body.citizenshipStatus;
        user.visaTitle = req.body.visaTitle || user.visaTitle;
        user.visaStartDate = req.body.visaStartDate || user.visaStartDate;
        user.visaEndDate = req.body.visaEndDate || user.visaEndDate;
        user.otherVisaTitle = req.body.otherVisaTitle || user.otherVisaTitle;
      }

      if (req.body.emergencyContacts) {
        user.emergencyContacts = req.body.emergencyContacts;
      }

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
      next(err);
    }
  },
};

module.exports = userController;
