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
        gallery: {
          description: String,
          images: [
            {
              typeMedia: String, //IMAGE, VIDEO
              url: String,
              description: String,
            },
          ],
        },
        options: [
          {
            name: String,
            value: String,
            description: String,
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
          parameters: [
            {
              slot: {
                type: ObjectId,
                ref: 'Slot',
              },
              name: String,
              value: String,
            },
          ],
        },
        loop: {
          intents: [
            {
              type: ObjectId,
              ref: 'Intent',
            },
          ],
          numberOfLoop: Number,
          actionFail: {
            type: ObjectId,
            ref: 'Action',
          },
          actionAskAgain: {
            type: ObjectId,
            ref: 'Action',
          },
          parameters: [
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
