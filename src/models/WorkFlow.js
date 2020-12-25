const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const WorkFlowSchema = new mongoose.Schema(
  {
    name: String,
    nodes : [
      {
        nodeId: ObjectId,
        type: String,
        refDataId: ObjectId,
        parentId: [ObjectId],
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Workflow', WorkFlowSchema);