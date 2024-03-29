const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
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
