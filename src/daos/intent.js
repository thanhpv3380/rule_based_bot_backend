const {
    Types: { ObjectId },
  } = require('mongoose');
  const Intent = require('../models/bot');

  const createIntent = async (data) => {
    const bot = await Intent.create(data);
    return bot;
  };

  const updateIntent = async (id, data) => {
    const intent = await Intent.findOneAndUpdate({_id: id}, data)
    return intent;
  }

  const findIntentById = async (id) => {
    Intent.findOne({_id: id, function(err, intent){
      intent.awesome = true;
      intent.index(function(err, res){
        return res;
      });
    }}
    );
  };

  const findIntentByName = async ({ name }) => {
    Intent.findOne({name: name, function(err, intent){
      intent.awesome = true;
      intent.index(function(err, res){
        return res;
      });
    }}
    );
  };

  const deleteIntent = async (id) => {
    Intent.findById(id, function(err, intent){
      if(err){
        console.log("not found");
        return;
      } else if(intent == null){
        return;
      }
      intent.remove(function(err1, intent){
        if(err1){
          console.log("err remove ",err1);
          return;
        }
      })
    });
}

  module.exports = {
      createIntent,
      updateIntent,
      findIntentById,
      findIntentByName,
      deleteIntent
  };