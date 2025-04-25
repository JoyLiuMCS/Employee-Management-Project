const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
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
      res.status(500).json({ message: 'Server error', error: err });
    }
  },

    // Get all users
    async createUser(req, res) {
        try {
          const { name, email, password } = req.body;
          const newUser = new User({ name, email, password });
    
          await newUser.save();
          res.status(201).json(newUser);
        } catch (err) {
          res.status(500).json({ message: 'Server error', error: err });
        }
      }
};



module.exports = userController;
