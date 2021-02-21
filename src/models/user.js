const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    email: String,
    password: String,
    dob: Date,
    phone: String,
    bots: [
      {
        type: ObjectId,
        ref: 'Bot',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('User', userSchema);
