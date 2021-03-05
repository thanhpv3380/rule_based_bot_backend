const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const botSchema = new mongoose.Schema(
  {
    name: String,
    createBy: {
      type: ObjectId,
      ref: 'User',
    },
    users: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    groupActionSingle: {
      type: ObjectId,
      ref: 'groupAction',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Bot', botSchema);
