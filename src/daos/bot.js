const {
    Types: { ObjectId },
  } = require('mongoose');
const { find } = require('../models/bot');
  const Bot = require('../models/bot');

  const createBot = async ({ name, userId }) => {
    var createBy = "5ff537736df4610fdce5ed09";
    const bot = await Bot.create({ name, createBy });
    return bot;
  };

  const updateBot = async ({ botId, data }) => {
      const bot = await Bot.findByIdAndUpdate(botId, data);
      return bot;
  }

  const findBotByUserId = async ({ userId }) =>{
      const bot = await Bot.find({userId : userId});
      return bot;
  }

  const findBot = async (condition) =>{
    if (ObjectId.isValid(condition)) {
        const bot = await Bot.findById(condition);
        return bot;
      }
    
      if (typeof condition === 'object' && condition !== null) {
        const bot = await Bot.findOne(condition);
        return bot;
      }
    
      return null;
  }

  const deleteBot = async (id) => {
      // await Bot.deleteOne({ _id : id});
      Bot.findById(id, function(err, bot){
        if(err){
          console.log("not found");
          return;
        } else if(bot == null){
          return;
        }
        bot.remove(function(err1, bot){
          if(err1){
            console.log("err remove ",err1);
            return;
          }
        })
      });
  }

  module.exports = {
      createBot,
      updateBot,
      findBotByUserId,
      findBot,
      deleteBot
  };