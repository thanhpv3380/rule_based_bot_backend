const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

var ObjectId = mongoose.Types.ObjectId;
const groupEntitySchema = new mongoose.Schema(
  {
    name: String,
    entities : [ObjectId],
    isGroup: Boolean,
    GroupEntityId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

groupEntitySchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

GroupEntity = module.exports = mongoose.model('GroupEntity', groupEntitySchema);

GroupEntity.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("GroupEntity mapping create");
      console.log(mapping);
  }
});
