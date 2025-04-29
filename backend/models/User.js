// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  building: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
});

const emergencyContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  relationship: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'hr'], default: 'employee' },

  firstName: { type: String },
  lastName: { type: String },
  middleName: { type: String },
  preferredName: { type: String },
  ssn: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'prefer not to say'] },

  phoneNumber: { type: String },
  workPhone: { type: String },

  address: addressSchema,

  citizenshipStatus: { type: String }, // citizen/green card/visa
  workAuthorizationTitle: { type: String }, // visaTitle
  visaStartDate: { type: Date },
  visaEndDate: { type: Date },
  otherVisaTitle: { type: String },

  emergencyContacts: [emergencyContactSchema],

  profilePictureUrl: { type: String },
  driversLicenseUrl: { type: String },
  workAuthorizationUrl: { type: String },

}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
