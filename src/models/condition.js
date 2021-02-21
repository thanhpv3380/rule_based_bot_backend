const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const conditionSchema = new mongoose.Schema(
  {
    conditions: [
      {
        parameter: String,
        intent: {
          type: ObjectId,
          ref: 'Intent',
        },
        operator: String,
        value: String,
      },
    ],
    operator: String,
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

module.exports = mongoose.model('Condition', conditionSchema);
