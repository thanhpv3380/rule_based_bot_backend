const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
var ObjectId = mongoose.Types.ObjectId;
const workFlowSchema = new mongoose.Schema(
  {
    name: String,
    nodes: [
      {
        node: {
          type: ObjectId,
        },
        type: String, //INTENT, ACTION, CONDITION, START, END
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

workFlowSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

WorkFlow = module.exports = mongoose.model('WorkFlow', workFlowSchema);

WorkFlow.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("WorkFlow mapping create");
      console.log(mapping);
  }
});