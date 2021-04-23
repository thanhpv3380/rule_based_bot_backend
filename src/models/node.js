const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const nodeSchema = new mongoose.Schema(
  {
    type: String, // INTENT, ACTION, CONDITION, START, END
    intent: {
      type: ObjectId,
      ref: 'Intent',
    },
    action: {
      type: ObjectId,
      ref: 'Action',
    },
    condition: {
      type: ObjectId,
      ref: 'Condition',
    },
    parent: [
      {
        node: {
          type: ObjectId,
          ref: 'Node',
        },
        type: {
          type: String,
        },
      },
    ],
    children: [
      {
        node: {
          type: ObjectId,
          ref: 'Node',
        },
        type: {
          type: String,
        },
      },
    ],
    position: {
      x: Number,
      y: Number,
    },
    workflow: {
      type: ObjectId,
      ref: 'Workflow',
    },
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Node', nodeSchema);
