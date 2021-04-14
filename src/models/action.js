/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const actionSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    actions: [
      {
        typeAction: String, // TEXT, MEDIA, CATEGORY, API, LOOP
        text: [String],
        media: {
          typeMedia: String, //IMAGE, VIDEO, AUDIO
          url: String,
          description: String,
        },
        options: [
          {
            name: String,
            value: String,
          },
        ],
        api: {
          method: String, // GET, POST
          url: String,
          headers: [
            {
              title: String,
              value: String,
            },
          ],
          body: [
            {
              title: String,
              value: String,
            },
          ],
          response: {},
          slots: [
            {
              id: ObjectId,
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
    groupAction: {
      type: ObjectId,
      ref: 'GroupAction',
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
);

module.exports = mongoose.model('Action', actionSchema);
