const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;

const botSchema = new mongoose.Schema(
  {
    name: String,
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

botSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

Bot = module.exports = mongoose.model('Bot', botSchema);


Bot.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("Bot mapping create");
      console.log(mapping);
  }
});

