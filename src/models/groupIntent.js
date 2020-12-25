const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupIntentSchema = new mongoose.Schema(
  {
    name: String,
    nodes: [
      {
        nodeId: ObjectId,
        type: String,
        refDataId: ObjectId,
        parentId: [ObjectId],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupIntent', groupIntentSchema);
