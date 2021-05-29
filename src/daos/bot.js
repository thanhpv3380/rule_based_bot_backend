const Bot = require('../models/bot');
const { findAll, findByCondition } = require('../utils/db');

const findAllBot = async ({
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
  });
  return bot;
};

const updateBot = async (botId, data) => {
  const bot = await Bot.findByIdAndUpdate(botId, data, {
    new: true,
  });
  return bot;
};

const addPermission = async (botId, data) => {
  const bot = await Bot.findByIdAndUpdate(
    botId,
    {
      $push: {
        permissions: { ...data },
      },
    },
    {
      new: true,
    },
  );
  return bot;
};

const deletePermission = async (botId, userId) => {
  const bot = await Bot.findByIdAndUpdate(
    botId,
    {
      $pull: {
        permissions: {
          user: userId,
        },
      },
    },
    {
      new: true,
    },
  );
  return bot;
};

const deleteBot = async (botId) => {
  await Bot.findByIdAndDelete(botId);
};

module.exports = {
  findAllBot,
  findBot,
  createBot,
  updateBot,
  deleteBot,
  addPermission,
  deletePermission,
};
