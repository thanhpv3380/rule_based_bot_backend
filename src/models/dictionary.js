const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

const dictionarySchema = new mongoose.Schema(
  {
    synonym: String,
    original: String,
    Dictionary: {
      type: ObjectId,
      ref: 'Dictionary',
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

// dictionarySchema.plugin(mongoosastic, {
//   hosts: [
//     'localhost:9200'
//   ]
// })

module.exports = mongoose.model('Dictionary', dictionarySchema);

// Dictionary.createMapping(function(err, mapping){
//   if(err){
//       console.log("error create mapping");
//       console.log(err);
//   }else{
//       console.log("Dictionary mapping create");
//       console.log(mapping);
//   }
// });
