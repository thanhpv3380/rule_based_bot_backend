const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const intentSchema = new mongoose.Schema(
  {
    name: String,
    isActive: Boolean,
    patterns: [
      {
        usersay: String,
        parameters: [
          {
            name: String,
            entity: {
              type: ObjectId,
              ref: 'Entity',
            },
            value: String,
          },
        ],
      },
    ],
    isMappingAction: Boolean,
    mappingAction: {
      type: ObjectId,
      ref: 'Action',
    },

    groupIntent: {
      type: ObjectId,
      ref: 'GroupIntent',
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

module.exports = mongoose.model('Intents', intentSchema);
