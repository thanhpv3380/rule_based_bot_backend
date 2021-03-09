const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupEntitySchema = new mongoose.Schema(
  {
    name: String,
    entities: [ObjectId],
    isGroup: Boolean,
    botId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupEntity', groupEntitySchema);
