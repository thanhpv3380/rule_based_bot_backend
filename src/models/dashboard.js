/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const dashboardSchema = new mongoose.Schema(
  {
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
    totalUsersay: Number,
    answeredUsersay: Number,
    notUnderstandUsersay: Number,
    defaultUsersay: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
