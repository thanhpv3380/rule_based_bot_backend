const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    avatar: String,
    email: String,
    password: String,
    dob: Date,
    phone: String,
    bots: [
      {
        type: ObjectId,
        ref: 'Bot',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})
User = module.exports = mongoose.model('User', userSchema);

User.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("User mapping create");
      console.log(mapping);
  }
});