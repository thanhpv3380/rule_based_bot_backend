const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;
const groupIntentSchema = new mongoose.Schema(
  {
    name: String,
    intents: [
      {
        type: ObjectId,
        ref: 'Intent',
      },
    ],
    isGroup: Boolean,
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

groupIntentSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

GroupIntent = module.exports = mongoose.model('GroupIntent', groupIntentSchema);

GroupIntent.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("GroupIntent mapping create");
      console.log(mapping);
  }
});
