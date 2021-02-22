const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const userSaySchema = new mongoose.Schema(
  {
    input: [String],
    output: {
      type: String, //TEXT, FLOW
      text: String,
      flow: {
        type: ObjectId,
        ref: 'Flow',
      },
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

module.exports = mongoose.model('UserSay', userSaysSchema);
