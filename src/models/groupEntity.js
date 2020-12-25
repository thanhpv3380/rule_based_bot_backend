const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupEntitySchema = new mongoose.Schema(
  {
    name: String,
    entities: [
      {
        type: ObjectId,
        ref: 'Entity',
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

module.exports = mongoose.model('GroupEntity', groupEntitySchema);
