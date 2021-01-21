const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

var ObjectId = mongoose.Types.ObjectId;
const entitySchema = new mongoose.Schema(
  {
    type: String,
    pattern: String,
    synonym: [
        {
            input:[String],
            output: String
        }
    ],
    patterns: [
        [
            {
                text: String
            },
            {
                entity: ObjectId
            }
        ]
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
entitySchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})

Entity = module.exports = mongoose.model('Entity', entitySchema);

Entity.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("Entity mapping create");
      console.log(mapping);
  }
});
