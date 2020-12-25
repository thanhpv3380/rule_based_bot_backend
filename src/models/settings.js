const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const settingSchema = new mongoose.Schema(
  {
    key: String,
    name: String,
    value: ObjectId
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Setting', settingSchema);