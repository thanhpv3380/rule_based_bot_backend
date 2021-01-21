const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
var ObjectId = mongoose.Types.ObjectId;
const intentSchema = new mongoose.Schema(
  {
    name: String,
    isActive: Boolean,
    patterns: [String],
    isMappingAction: Boolean,
    mappingAction: {
      type: ObjectId,
      ref: 'Action',
    },
    parameters: [
      {
        name: String,
        entity: {
          type: ObjectId,
          ref: 'Entity',
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

intentSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

Intent = module.exports = mongoose.model('Intent', intentSchema);

Intent.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("Intent mapping create");
      console.log(mapping);
  }
});
