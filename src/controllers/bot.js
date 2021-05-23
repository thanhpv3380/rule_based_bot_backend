const botService = require('../services/bot');

const getAllBot = async (req, res) => {
  const { key, search, limit, offset, fields, sort } = req.query;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBot({
    userId: user.id,
    key,
    searchFields: search,
    limit,
    offset,
    fields,
    sort,
  });

  return res.send({ status: 1, result: { bots, metadata } });
};

const getAllBotByRole = async (req, res) => {
  const { sort } = req.query;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBotByRole({
    userId: user.id,
    sort,
  });

  return res.send({ status: 1, result: { bots, metadata } });
};

const getBotById = async (req, res) => {
  const { id } = req.params;
  const bot = await botService.findBotById(id);
  return res.send({ status: 1, result: { bot } });
};

const createBot = async (req, res) => {
  const { user } = req;
  const { name, description } = req.body;
  const bot = await botService.createBot(user.id, { name, description });
  return res.send({ status: 1, result: { bot } });
};

const updateBot = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { user } = req;
  const bot = await botService.updateBot(id, user.id, data);
  return res.send({ status: 1, result: { bot } });
};

const deleteBot = async (req, res) => {
  const { id } = req.params;
  await botService.deleteBot(id);
  return res.send({ status: 1 });
};

const addUserInBot = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({ status: 1, result: { bot } });
};

const removeUserInBot = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({ status: 1, result: { bot } });
};

const getBotByToken = async (req, res) => {
  const { botToken } = req.params;
  const bot = await botService.findBotByToken(botToken);
  return res.send({ status: 1, result: bot });
};

const getRoleInBot = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const role = await botService.findRoleInBot({ botId: id, userId: user._id });
  return res.send({ status: 1, result: { role } });
};

module.exports = {
  getAllBot,
  getAllBotByRole,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
  getBotByToken,
  getRoleInBot,
};
