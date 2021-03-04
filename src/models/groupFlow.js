const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

const groupFlowSchema = new mongoose.Schema(
  {
    name: String,
    workFlows: [ObjectId],
    isGroup: Boolean,
    GroupFlowId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// groupFlowSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })

module.exports = mongoose.model('GroupFlow', groupFlowSchema);

// GroupFlow.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("GroupFlow mapping create");
//       console.log(mapping);
//   }
// });

// var stream = GroupFlow.synchronize();
// var count = 0;
// stream.on('data', function(){
//   count++;
// })

// stream.on('close', function(){
//   console.log("indexed " + count + " documents");
// })
