const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const dictionarySchema = new mongoose.Schema(
  {
    synonym: String,
    original: String,
    bot: {
      type: ObjectId,
      ref: 'Bot',
    },
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

module.exports = mongoose.model('Dictionary', dictionarySchema);
