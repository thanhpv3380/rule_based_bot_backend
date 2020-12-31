const {
    Types: { ObjectId },
  } = require('mongoose');
const { find } = require('../models/bot');
  const Bot = require('../models/bot');

  const createBot = async ({ name, userId }) => {
    const user = await Bot.create({ name, userId });
    return user;
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

  const deleteBot = async ({ id }) => {
      await Bot.findByIdAndDelete({id});
  }

  module.exports = {
      createBot,
      updateBot,
      findBotByUserId,
      findBot,
      deleteBot
  };