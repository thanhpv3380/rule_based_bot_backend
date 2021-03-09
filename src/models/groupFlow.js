const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupFlowSchema = new mongoose.Schema(
  {
    name: String,
    workFlows: [ObjectId],
    isGroup: Boolean,
    GroupFlowId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupFlow', groupFlowSchema);
