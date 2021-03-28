const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const groupFlowSchema = new mongoose.Schema(
  {
    name: String,
    workFlows: [ObjectId],
    isGroup: Boolean,
    botId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupFlow', groupFlowSchema);
