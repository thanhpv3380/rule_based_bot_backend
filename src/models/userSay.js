const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
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
userSaysSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})
UserSay = module.exports = mongoose.model('UserSay', userSaysSchema);

UserSay.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("UserSay mapping create");
      console.log(mapping);
  }
});