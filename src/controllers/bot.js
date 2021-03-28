const botService = require('../services/bot');

const getAllBot = async (req, res) => {
  const {key, searchFields, limit, offset, fields, sort} = req.query;
  const {user} = req;
  const {bots, metadata} = await botService.findAllBot({
    userId: user.id,
    key,
    searchFields,
    limit,
    offset,
    fields,
    sort,
  });
  return res.send({status: 1, result: {bots, metadata}});
};

const getBotById = async (req, res) => {
  const {id} = req.params;
  const bot = await botService.findBotById(id);
  return res.send({status: 1, result: {bot}});
};

const createBot = async (req, res) => {
  const {user} = req;
  const {name} = req.body;
  const bot = await botService.createBot(user.id, {name});
  return res.send({status: 1, result: {bot}});
};

const updateBot = async (req, res) => {
  const {id} = req.params;
  const {name} = req.body;
  const {user} = req;
  const bot = await botService.updateBot(id, user.id, {
    name,
  });
  return res.send({status: 1, result: {bot}});
};

const deleteBot = async (req, res) => {
  const {id} = req.params;
  await botService.deleteBot(id);
  return res.send({status: 1});
};

const addUserInBot = async (req, res) => {
  const {id, userId} = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({status: 1, result: {bot}});
};

const removeUserInBot = async (req, res) => {
  const {id, userId} = req.params;
  const bot = await botService.addUserInBot(id, userId);
  return res.send({status: 1, result: {bot}});
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
