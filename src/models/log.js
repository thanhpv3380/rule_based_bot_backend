/* eslint-disable spaced-comment */
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;

const logSchema = new mongoose.Schema(
  {
    session: {
      type: ObjectId,
      ref: 'Session',
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
    messages: [
      {
        type: String, //BOT, USER
        message: {
          text: String,
          attachment: {
            type: String, //IMAGE, AUDIO, VIDEO, FILE, OPTION
            payload: {
              url: String,
              elements: [
                {
                  label: String,
                  value: String,
                },
              ],
            },
          },
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// logSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })

module.exports = mongoose.model('Log', logSchema);

// Log.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("Log mapping create");
//       console.log(mapping);
//   }
// });
