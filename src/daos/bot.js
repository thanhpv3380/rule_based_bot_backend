const Bot = require('../models/bot');
const { findAll, findByCondition } = require('../utils/db');

const findAllBot = async (userId, populate) => {
  const dictionaries = await Bot.find({ users: userId }).populate(populate);
  return dictionaries;
};

const findAllBotByCondition = async ({
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort,
  populate,
}) => {
  const { data, metadata } = await findAll({
    model: Bot,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return {
    data,
    metadata,
  };
};

const findBot = async (condition, fields, populate) => {
  const bot = await findByCondition(Bot, condition, fields, populate);
  return bot;
};

const createBot = async (data, userId) => {
  const bot = await Bot.create({
    ...data,
    createBy: userId,
    users: [userId],
  });
  return bot;
};

const updateBot = async (botId, data) => {
  const bot = await Bot.findByIdAndUpdate(botId, data);
  return bot;
};

const deleteBot = async (botId) => {
  await Bot.findByIdAndDelete(botId);
};

const addUserInBot = async (botId, userId) => {
  const bot = await Bot.findByIdAndUpdate(botId, {
    $push: {
      users: userId,
    },
  });
  return bot;
};

const removeUserInBot = async (botId, userId) => {
  const bot = await Bot.findByIdAndUpdate(botId, {
    $pull: {
      users: userId,
    },
  });
  return bot;
};

module.exports = {
  findAllBot,
  findAllBotByCondition,
  findBot,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
};
