const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupFlowSchema = new mongoose.Schema(
  {
    name: String,
    flows: [
      {
        type: ObjectId,
        ref: 'Flow',
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

module.exports = mongoose.model('GroupFlow', groupFlowSchema);
