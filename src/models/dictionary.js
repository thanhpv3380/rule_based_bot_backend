const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const dictionarySchema = new mongoose.Schema(
  {
    acronym: String,
    original: String,
    Dictionary: {
      type: ObjectId,
      ref: 'Dictionary',
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
