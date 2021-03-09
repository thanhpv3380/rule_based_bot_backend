const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

<<<<<<< HEAD
=======
const { ObjectId } = mongoose.Types;

>>>>>>> develop
const groupEntitySchema = new mongoose.Schema(
  {
    name: String,
    entities: [ObjectId],
    isGroup: Boolean,
    GroupEntityId: ObjectId,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('GroupEntity', groupEntitySchema);
