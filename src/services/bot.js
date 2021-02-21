const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const botDao = require('../daos/bot');

const createBot = async ({ name }) => {
  var userId = ' ';
  const bot = await botDao.createBot({ name, userId });
  return bot;
};

const updateBot = async ({ botId, data }) => {
  const bot = await botDao.updateBot({ botId, data });
  return bot;
};

const findBotByUserId = async (userId) => {
  const createBy = userId;
  const bot = await botDao.findBot(createBy);
  return bot;
};

const findBotById = async (id) => {
  const bot = await botDao.findBot(id);
  if (!bot) throw new CustomError(errorCodes.BOT_NOT_FOUND);
  return bot;
};

const findAllBot = async (name) => {
  console.log(name);
  if (!name) {
    name = "";
  }
  const bots = await botDao.findAllBot(name);
  return { bots, metadata: { total: bots.length } };
};

const deleteBotById = async (id) => {
  await botDao.deleteBot(id);
};

module.exports = {
  createBot,
  updateBot,
  findBotByUserId,
  findBotById,
  findAllBot,
  deleteBotById,
};
