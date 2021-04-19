/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const workFlowSchema = new mongoose.Schema(
  {
    name: String,
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
        position: {
          x: Number,
          y: Number,
        },
      },
    ],
    groupWorkFlow: {
      type: ObjectId,
      refPath: 'GroupWorkFlow',
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

module.exports = mongoose.model('WorkFlow', workFlowSchema);
