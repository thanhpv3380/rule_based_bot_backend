/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const conversationSchema = new mongoose.Schema(
  {
    sessionId: String,
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
    workflow: {
      type: ObjectId,
      ref: 'Workflow',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Conversation', conversationSchema);
