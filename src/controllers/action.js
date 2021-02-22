const actionService = require('../services/action');

const getAllAction = async (req, res) => {
  const { bot } = req;
  const { actions, metadata } = await actionService.findAllAction(bot.id);
  return res.send({ status: 1, results: { actions, metadata } });
};

const getActionById = async (req, res) => {
  const { id } = req.params;
  const action = await actionService.findActionById(id);
  return res.send({ status: 1, result: action });
};

const createAction = async (req, res) => {
  const { bot, user } = req;
  const { name, groupActionId, actions } = req.body;
  const action = await actionService.createAction({
    name,
    actions,
    userId: user.id,
    groupActionId,
    botId: bot.id,
  });
  return res.send({ status: 1, results: action });
};

const updateAction = async (req, res) => {
  const { id } = req.params;
  const { name, actions, groupActionId } = req.body;
  const action = await actionService.updateAction({
    id,
    name,
    actions,
    groupActionId,
  });
  return res.send({ status: 1, results: action });
};

const deleteAction = async (req, res) => {
  const { id } = req.params;
  await actionService.deleteActionById(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllAction,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
};
