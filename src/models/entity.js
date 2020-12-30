const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const entitySchema = new mongoose.Schema(
  {
    type: String, // REGEX, SYNONYM, COMPLEX
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
          entity: {
            type: ObjectId,
            ref: 'Entity',
          },
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
