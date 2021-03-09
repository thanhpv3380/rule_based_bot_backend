/* eslint-disable spaced-comment */
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;

const settingSchema = new mongoose.Schema(
  {
    key: String, //ACTION, ENTITY, INTENT
    name: String,
    value: {
      type: ObjectId,
      refPath: 'valueModel',
    },
    valueModel: {
      type: String,
      enum: ['Action', 'Entity', 'Intent'],
    },
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
// settingSchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })

module.exports = mongoose.model('Setting', settingSchema);

// Setting.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("Setting mapping create");
//       console.log(mapping);
//   }
// });
