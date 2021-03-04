const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

const groupActionSchema = new mongoose.Schema(
  {
    name: String,
    actions: [ObjectId],
    isGroup: Boolean,
    GroupActionId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// groupActionSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })
module.exports = mongoose.model('GroupAction', groupActionSchema);

// GroupAction.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("GroupAction mapping create");
//       console.log(mapping);
//   }
// });
