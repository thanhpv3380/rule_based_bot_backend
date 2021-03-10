/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupActionSchema = new mongoose.Schema(
  {
    name: String,
    groupType: Number, //1: DEFAULT, 2: GROUP, 3: GROUP_SINGLE,
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
