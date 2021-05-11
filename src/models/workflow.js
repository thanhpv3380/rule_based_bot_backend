/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const workflowSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
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
