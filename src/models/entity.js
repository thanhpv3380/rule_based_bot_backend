const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const entitySchema = new mongoose.Schema(
  {
    type: String,
    pattern: String,
    synonym: [
        {
            input:[String],
            output: String
        }
    ],
    patterns: [
        [
            {
                text: String
            },
            {
                entity: ObjectId
            }
        ]
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Entity', entitySchema);