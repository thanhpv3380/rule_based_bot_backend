/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const logSchema = new mongoose.Schema(
  {
    session: {
      type: ObjectId,
      ref: 'Session',
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
    messages: [
      {
        type: String, //BOT, USER
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

module.exports = mongoose.model('Log', logSchema);
