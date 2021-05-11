/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const messageLogSchema = new mongoose.Schema(
  {
    session: String,
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
    type: { type: String }, //BOT, USER
    status: { type: String },
    workflow: {
      type: ObjectId,
      ref: 'Workflow',
    },
    message: {
      text: String,
      attachment: {
        type: String, //IMAGE, AUDIO, VIDEO, FILE, CATEGORY
        payload: {
          url: String,
          elements: [
            {
              label: String,
              value: String,
            },
          ],
        },
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('MessageLog', messageLogSchema);
