const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const dictionarySchema = new mongoose.Schema(
  {
    synonym: String,
    original: String,
    bot: ObjectId
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Dictionary', dictionarySchema);