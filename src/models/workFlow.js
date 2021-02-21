/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

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
    createBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('WorkFlow', workFlowSchema);
