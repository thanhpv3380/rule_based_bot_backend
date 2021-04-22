/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const workflowSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    nodes: [
      {
        type: {
          type: String,
        }, //INTENT, ACTION, CONDITION, START, END
        intent: {
          type: ObjectId,
          refPath: 'Intent',
        },
        action: {
          type: ObjectId,
          refPath: 'Action',
        },
        condition: {
          type: ObjectId,
          refPath: 'Condition',
        },
        parent: [ObjectId],
        children: [{ type: ObjectId, refPath: 'workflows.nodes' }],
        position: {
          x: Number,
          y: Number,
        },
      },
    ],
    zoom: Number,
    offsetX: Number,
    offsetY: Number,
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
  { typeKey: '$type' },
);

module.exports = mongoose.model('Workflow', workflowSchema);
