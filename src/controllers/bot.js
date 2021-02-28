const botService = require('../services/bot');

const getAllBot = async (req, res) => {
  const { key, searchFields, limit, offset, fields, sort } = req.query;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBot({
    userId: user.id,
    key,
    searchFields,
    limit,
    offset,
    fields,
    sort,
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
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
};
