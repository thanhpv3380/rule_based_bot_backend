const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const conditionSchema = new mongoose.Schema(
  {
    conditions: [
      {
        parameter: {
          type: ObjectId,
          ref: 'Intent',
        },
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
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

conditionSchema.virtual('parameter', {
  ref: 'Intent',
  localField: 'parameters._id',
  foreignField: 'conditions.parameter',
});

module.exports = mongoose.model('Condition', conditionSchema);
