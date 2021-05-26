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
    user: String,
    workflow: {
      type: ObjectId,
      ref: 'Workflow',
    },
    messages: [
      {
        from: String, //BOT, USE
        status: String, // trả lời được hay ko,...
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
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('MessageLog', messageLogSchema);
