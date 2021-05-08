/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const messageSchema = new mongoose.Schema(
  {
    session: {
      type: ObjectId,
      ref: 'Session',
    },
    type: String, //BOT, USER
    status: String,
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

module.exports = mongoose.model('Message', messageSchema);
