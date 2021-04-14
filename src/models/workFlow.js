/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const workflowSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
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
    groupWorkflow: {
      type: ObjectId,
      ref: 'GroupWorkflow',
    },
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
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

module.exports = mongoose.model('Workflow', workflowSchema);
