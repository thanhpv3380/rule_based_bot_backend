const mongoose = require('mongoose');

const mongoosastic = require('mongoosastic');
var ObjectId = mongoose.Types.ObjectId;
const actionSchema = new mongoose.Schema(
  {
    name: String,
    actions: [
      {
        type: String, //TEXT, MAIL, MEDIA, API, LOOP
        text: [String],
        email: {
          to: String,
          title: String,
          body: String,
        },
        media: {
          text: String,
          attachment: {
            type: String, ////IMAGE, AUDIO, VIDEO, FILE, OPTION
            payload: {
              url: String,
              elements: [
                {
                  label: String,
                  value: String,
                },
              ],
            },
          },
        },
        api: {
          method: String, //GET, POST
          url: String,
          headers: [
            {
              name: String,
              value: String,
            },
          ],
          body: [
            {
              name: String,
              value: String,
            },
          ],
        },
        loop: {
          intent: [
            {
              type: ObjectId,
              ref: 'Intent',
            },
          ],
          actionAskAgain: {
            type: ObjectId,
            ref: 'Action',
          },
          numberOfLoop: Number,
          actionFail: {
            type: ObjectId,
            ref: 'Action',
          },
          parameter: [
            {
              name: String,
              intent: {
                type: ObjectId,
                ref: 'Intent',
              },
            },
          ],
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

actionSchema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
})


Action = module.exports = mongoose.model('Action', actionSchema);

Action.createMapping(function(err, mapping){
  if(err){
      console.log("error create mapping");
      console.log(err);
  }else{
      console.log("Action mapping create");
      console.log(mapping);
  }
});

var stream = Action.synchronize();
var count = 0;
stream.on('data', function(){
  count++;
})

stream.on('close', function() {
  console.log("indexed " + count + " documents");
})