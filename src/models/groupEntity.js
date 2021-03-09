const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

const groupEntitySchema = new mongoose.Schema(
  {
    name: String,
    entities: [ObjectId],
    isGroup: Boolean,
    GroupEntityId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupEntity', groupEntitySchema);
