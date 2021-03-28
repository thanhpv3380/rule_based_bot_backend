const mongoose = require('mongoose');

const {ObjectId} = mongoose.Types;

const intentSchema = new mongoose.Schema(
  {
    name: String,
    isActive: Boolean,
    patterns: [String],
    isMappingAction: Boolean,
    mappingAction: {
      type: ObjectId,
      ref: 'Action',
    },
    parameters: [
      {
        parameterName: String,
        required: Boolean,
        entity: {
          type: ObjectId,
          ref: 'Entity',
        },
        response: {
          actionAskAgain: {
            type: ObjectId,
            ref: 'Entity',
          },
          numberOfLoop: Number,
          actionBreak: {
            type: ObjectId,
            ref: 'Entity',
          },
        },
      },
    ],
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

module.exports = mongoose.model('Intent', intentSchema);
