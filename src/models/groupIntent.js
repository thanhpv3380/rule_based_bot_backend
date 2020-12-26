const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupIntentSchema = new mongoose.Schema(
  {
    name: String,
    intents: [
      {
        type: ObjectId,
        ref: 'Intent',
      },
    ],
    isGroup: Boolean,
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

module.exports = mongoose.model('GroupIntent', groupIntentSchema);
