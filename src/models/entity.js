const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const entitySchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    type: Number,
    pattern: String,
    synonyms: [
      {
        input: [String],
        output: String,
      },
    ],
    patterns: [
      [
        {
          text: String,
        },
        {
          entity: {
            type: ObjectId,
            ref: 'GroupEntity',
          },
        },
      ],
    ],
    groupEntity: {
      type: ObjectId,
      ref: 'GroupEntity',
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

module.exports = mongoose.model('Entity', entitySchema);
