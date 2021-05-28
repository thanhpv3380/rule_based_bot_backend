const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const botSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    imageUrl: String,
    createBy: {
      type: ObjectId,
      ref: 'User',
    },
    botToken: String,
    permissions: [
      {
        user: {
          type: ObjectId,
          ref: 'User',
        },
        role: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Bot', botSchema);
