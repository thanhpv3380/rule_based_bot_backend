const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

const conditionSchema = new mongoose.Schema(
  {
    conditions: [
      {
        parameter: String,
        intent: {
          type: ObjectId,
          ref: 'Intent',
        },
        operator: String,
        value: String,
      },
    ],
    operator: String,
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

// conditionSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })
module.exports = mongoose.model('Condition', conditionSchema);

// Condition.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("Condition mapping create");
//       console.log(mapping);
//   }
// });
