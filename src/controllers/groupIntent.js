const groupIntentService = require('../services/groupIntent');

const getAllGroupIntentAndItem = async (req, res) => {
  const { keyword } = req.body;
  const { bot } = req;
  const groupIntents = await groupIntentService.findAllGroupIntentAndItem({
    keyword,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupIntents } });
};

const getGroupIntentById = async (req, res) => {
  const { id } = req.params;
  const groupIntent = await groupIntentService.findGroupIntentById(id);
  return res.send({ status: 1, result: { groupIntent } });
};

const createGroupIntent = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupIntent = await groupIntentService.createGroupIntent({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupIntent } });
};

const updateGroupIntent = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { bot } = req;
  const groupIntent = await groupIntentService.updateGroupIntent({
    id,
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupIntent } });
};

const deleteGroupIntent = async (req, res) => {
  const { id } = req.params;
  await groupIntentService.deleteGroupIntent(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupIntentAndItem,
  getGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
