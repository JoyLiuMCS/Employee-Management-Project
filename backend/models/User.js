// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Address子Schema
const addressSchema = new mongoose.Schema({
  building: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
});

// Emergency Contact子Schema
const emergencyContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  relationship: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  // 基本账户信息
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'hr'], default: 'employee' },

  // 个人信息（Onboarding）
  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  preferredName: { type: String },
  ssn: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'prefer not to say'] },

  // 联系方式
  phoneNumber: { type: String },
  workPhone: { type: String },

  // 地址
  address: addressSchema,

  // 签证信息
  citizenshipStatus: { type: String }, // citizen/green card/visa
  workAuthorizationTitle: { type: String }, // visaTitle
  visaStartDate: { type: Date },
  visaEndDate: { type: Date },
  otherVisaTitle: { type: String },

  // 紧急联系人
  emergencyContacts: [emergencyContactSchema],

  // 上传的文件（存url或path）
  profilePictureUrl: { type: String },
  driversLicenseUrl: { type: String },
  workAuthorizationUrl: { type: String },

}, { timestamps: true });

// 保存前加密密码
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 密码比较
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
