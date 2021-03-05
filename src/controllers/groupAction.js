const groupActionService = require('../services/groupAction');

const getAllGroupActionAndItem = async (req, res) => {
  const { keyword } = req.body;
  const { bot } = req;
  const data = await groupActionService.findAllGroupActionAndItem({
    keyword,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { data } });
};

const getGroupActionById = async (req, res) => {
  const { id } = req.params;
  const groupAction = await groupActionService.findGroupActionById(id);
  return res.send({ status: 1, result: groupAction });
};

const createGroupAction = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupAction = await groupActionService.createGroupAction({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: groupAction });
};

const updateGroupAction = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { bot } = req;
  const groupAction = await groupActionService.updateGroupAction({
    id,
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: groupAction });
};

const deleteGroupAction = async (req, res) => {
  const { id } = req.params;
  await groupActionService.deleteGroupAction(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupActionAndItem,
  getGroupActionById,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
