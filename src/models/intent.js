const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

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
        name: String,
        entity: {
          type: ObjectId,
          ref: 'Entity',
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Intent', intentSchema);
