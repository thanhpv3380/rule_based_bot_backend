/* eslint-disable radix */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const botDao = require('../daos/bot');

const findAllBot = async (userId) => {
  const bots = await botDao.findAllBot(userId, ['createBy', 'users']);
  return bots;
};

const findAllBotByCondition = async ({
  userId,
  key,
  searchFields,
  limit,
  offset,
  fields,
  sort,
  query,
}) => {
  const { data, metadata } = await botDao.findAllBotByCondition({
    key,
    searchFields,
    query: { ...query, users: userId },
    offset,
    limit,
    fields,
    sort,
    populate: ['createBy', 'users'],
  });

  return { bots: data, metadata };
};

const findBotById = async (id) => {
  const bot = await botDao.findBot({ _id: id }, null, ['createBy', 'users']);
  if (!bot) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return bot;
};

const createBot = async (userId, data) => {
  const { name } = data;
  const botExists = await botDao.findBot({
    name,
  });

  if (botExists) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const Bot = await botDao.createBot(data, userId);
  return Bot;
};

const updateBot = async (id, data) => {
  const botExists = await botDao.findBot({
    _id: id,
  });

  if (!botExists) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  const { name } = data;
  const botNameExists = await botDao.findBot({
    name,
    _id: { $not: { $eq: id } },
  });

  if (botNameExists) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const bot = await botDao.updateBot(id, data);
  return bot;
};

const deleteBot = async (id) => {
  await botDao.deleteBot(id);
};

const addUserInBot = async (botId, userId) => {
  const bot = await botDao.addUserInBot(botId, userId);
  return bot;
};

const removeUserInBot = async (botId, userId) => {
  const bot = await botDao.removeUserInBot(botId, userId);
  return bot;
};

module.exports = {
  findAllBot,
  findAllBotByCondition,
  findBotById,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
};
