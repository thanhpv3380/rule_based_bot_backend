const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    email: String,
    password: String,
    dob: Date,
    phone: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('User', userSchema);
