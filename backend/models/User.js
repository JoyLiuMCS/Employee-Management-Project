// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // 原有
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'hr'], default: 'employee' },

  // 🆕 以下是为了 employee profile 页面的字段
  firstName: { type: String },
  lastName: { type: String },
  preferredName: { type: String },
  ssn: { type: String },
  workAuthorizationTitle: { type: String },
  phoneNumber: { type: String },
});

// 在保存用户之前加密密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 比较密码的方法
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
