const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const workFlowSchema = new mongoose.Schema(
  {
    name: String,
    nodes: [
      {
        node: {
          type: ObjectId,
        },
        type: String, //INTENT, ACTION, CONDITION, START, END
        refData: {
          type: ObjectId,
          refPath: 'refDataModel',
        },
        refDataModel: {
          type: String,
          enum: ['INTENT', 'ACTION', 'CONDITION'],
        },
        parent: [
          {
            type: ObjectId,
            refPath: 'parentModel',
          },
        ],
        parentModel: {
          type: String,
          enum: ['INTENT', 'ACTION', 'CONDITION'],
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('WorkFlow', workFlowSchema);