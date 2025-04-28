const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
        next(err);
      //res.status(500).json({ message: 'Server error', error: err });
    }
  },

  // Get a specific user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);  // Return the user with the given ID
    } catch (err) {
        next(err);
      //res.status(500).json({ message: 'Server error', error: err });
    }
  },

};



module.exports = userController;
