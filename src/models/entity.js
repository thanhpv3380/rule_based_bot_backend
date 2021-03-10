const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const entitySchema = new mongoose.Schema(
  {
    type: String,
    name: String,
    pattern: String,
    synonym: [
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
          entity: ObjectId,
        },
      ],
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

module.exports = mongoose.model('Entity', entitySchema);
