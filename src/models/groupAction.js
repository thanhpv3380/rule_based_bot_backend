const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupActionSchema = new mongoose.Schema(
  {
    name: String,
    actions: [
      {
        type: ObjectId,
        ref: 'Action',
      },
    ],
    isGroup: Boolean,
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupAction', groupActionSchema);
