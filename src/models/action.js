/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const actionSchema = new mongoose.Schema(
  {
    name: String,
    actions: [
      {
        type: String, //TEXT, MAIL, MEDIA, API, LOOP
        text: [String],
        email: {
          to: String,
          title: String,
          body: String,
        },
        media: {
          text: String,
          attachment: {
            type: String, ////IMAGE, AUDIO, VIDEO, FILE, OPTION
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
        api: {
          method: String, //GET, POST
          url: String,
          headers: [
            {
              name: String,
              value: String,
            },
          ],
          body: [
            {
              name: String,
              value: String,
            },
          ],
        },
        loop: {
          intent: [
            {
              type: ObjectId,
              ref: 'Intent',
            },
          ],
          actionAskAgain: {
            type: ObjectId,
            ref: 'Action',
          },
          numberOfLoop: Number,
          actionFail: {
            type: ObjectId,
            ref: 'Action',
          },
          parameter: [
            {
              name: String,
              intent: {
                type: ObjectId,
                ref: 'Intent',
              },
            },
          ],
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Action', actionSchema);
