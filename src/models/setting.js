/* eslint-disable spaced-comment */
const mongoose = require('mongoose');

const {ObjectId} = mongoose.Types;

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

module.exports = mongoose.model('Setting', settingSchema);
