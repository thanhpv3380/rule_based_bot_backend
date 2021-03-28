const mongoose = require('mongoose');

const {ObjectId} = mongoose.Types;
const groupIntentSchema = new mongoose.Schema(
  {
    name: String,
    groupType: Number, // 1: DEFAULT, 2: GROUP, 3: GROUP_SINGLE,
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

module.exports = mongoose.model('GroupIntent', groupIntentSchema);
