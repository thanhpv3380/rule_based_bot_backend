const groupActionService = require('../services/groupAction');

const getAllGroupAction = async (req, res) => {
  const { bot } = req;
  const {
    groupActions,
    metadata,
  } = await groupActionService.findAllGroupAction(bot.id);
  return res.send({ status: 1, results: { groupActions, metadata } });
};

const getAllGroupActionAndItem = async (req, res) => {
  const { keyword } = req.body;
  const { bot } = req;
  const data = await groupActionService.findAllGroupActionAndItem({
    keyword,
    botId: bot.Id,
  });
  return res.send({ status: 1, results: { data } });
};

const getGroupActionById = async (req, res) => {
  const { id } = req.params;
  const groupAction = await groupActionService.findById(id);
  return res.send({ status: 1, results: groupAction });
};

const createGroupAction = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupAction = await groupActionService.createGroupAction({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, results: groupAction });
};

const updateGroupAction = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const groupAction = await groupActionService.updateGroupAction({ id, name });
  return res.send({ status: 1, results: groupAction });
};

const deleteGroupAction = async (req, res) => {
  const { id } = req.params;
  await groupActionService.deleteGroupAction(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupAction,
  getAllGroupActionAndItem,
  getGroupActionById,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
