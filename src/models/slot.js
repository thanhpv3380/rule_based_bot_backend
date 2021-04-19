const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const slotSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    dataType: Number, // Number, Floar, Text,...
    slotType: Number, // 1 default
    customData: {
      values: [],
      conditions: [],
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

module.exports = mongoose.model('Slot', slotSchema);
