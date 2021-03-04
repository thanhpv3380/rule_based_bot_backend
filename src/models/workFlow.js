const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;
const workFlowSchema = new mongoose.Schema(
  {
    name: String,
    nodes: [
      {
        node: {
          type: ObjectId,
        },
        type: String, // INTENT, ACTION, CONDITION, START, END
        refData: {
          type: ObjectId,
          refPath: 'refDataModel',
        },
        refDataModel: {
          type: String,
          enum: ['INTENT', 'ACTION', 'CONDITION'],
        },
        parent: [
          {
            type: ObjectId,
            refPath: 'parentModel',
          },
        ],
        parentModel: {
          type: String,
          enum: ['INTENT', 'ACTION', 'CONDITION'],
        },
      },
    ],
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

// workFlowSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })

module.exports = mongoose.model('WorkFlow', workFlowSchema);

// WorkFlow.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("WorkFlow mapping create");
//       console.log(mapping);
//   }
// });
