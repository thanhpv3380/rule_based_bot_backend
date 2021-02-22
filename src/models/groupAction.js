const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const groupActionSchema = new mongoose.Schema(
  {
    name: String,
    actions : [ObjectId],
    isGroup: Boolean,
    botId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupAction', groupActionSchema);