const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;
const groupWorkFlowSchema = new mongoose.Schema(
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

module.exports = mongoose.model('GroupWorkFlow', groupWorkFlowSchema);
