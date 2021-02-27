const botService = require('../services/bot');

const getAllBot = async (req, res) => {
  const { user } = req;
  const bots = await botService.findAllBot(user.id);
  return res.send({ status: 1, results: { bots } });
};

const getAllBotByCondition = async (req, res) => {
  const { key, searchFields, limit, offset, fields, sort, query } = req.body;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBotByCondition({
    userId: user.id,
    key,
    searchFields,
    limit,
    offset,
    fields,
    sort,
    query,
  });
  return res.send({ status: 1, results: { bots, metadata } });
};

const getBotById = async (req, res) => {
  const { id } = req.params;
  const bot = await botService.findBotById(id);
  return res.send({ status: 1, results: { bot } });
};

const createBot = async (req, res) => {
  const { user } = req;
  const { name } = req.body;
  const bot = await botService.createBot(user.id, { name });
  return res.send({ status: 1, results: bot });
};

const updateBot = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const bot = await botService.updateBot(id, {
    name,
  });
  return res.send({ status: 1, results: bot });
};

const deleteBot = async (req, res) => {
  const { id } = req.params;
  await botService.deleteBot(id);
  return res.send({ status: 1 });
};

const addUserInBot = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({ status: 1, results: bot });
};

const removeUserInBot = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({ status: 1, results: bot });
};

module.exports = {
  getAllBot,
  getAllBotByCondition,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
};
