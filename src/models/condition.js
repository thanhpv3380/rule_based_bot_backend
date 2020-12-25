const mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
const condidtionSchema = new mongoose.Schema(
  {
    conditions: [
        {
              parameter: String,
              intentId: objectId,
              operator: String,
              value : String
         }
    ],
    operator: String
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('condition', condidtionSchema);