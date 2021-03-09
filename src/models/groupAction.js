const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const groupActionSchema = new mongoose.Schema(
  {
    name: String,
    actions: [ObjectId],
    isGroup: Boolean,
    GroupActionId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupAction', groupActionSchema);
