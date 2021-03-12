/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */
const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const { ObjectId } = mongoose.Types;

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
    groupIntent: {
      type: ObjectId,
      ref: 'GroupIntent',
    },
    bot: {
      type: ObjectId,
      ref: 'Bot',
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

intentSchema.plugin(mongoosastic, {
  hosts: ['localhost:9200'],
});

Intent = module.exports = mongoose.model('Intents', intentSchema);

Intent.createMapping(function (err, mapping) {
  if (err) {
    console.log('error create mapping');
    console.log(err);
  } else {
    console.log('Intent mapping create');
    console.log(mapping);
  }
});
