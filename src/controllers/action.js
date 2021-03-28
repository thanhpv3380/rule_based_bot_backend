const actionService = require('../services/action');

const getAllActionByBotId = async (req, res) => {
  const {bot} = req;
  const {keyword} = req.query;
  const actions = await actionService.findAllActionByBotId({
    keyword,
    botId: bot.id,
  });
  return res.send({status: 1, result: {actions}});
};

const getActionById = async (req, res) => {
  const {id} = req.params;
  const action = await actionService.findActionById(id);
  return res.send({status: 1, result: {action}});
};

const createAction = async (req, res) => {
  const {bot, user} = req;
  const {name, groupAction, actions} = req.body;
  const action = await actionService.createAction({
    name,
    actions,
    userId: user.id,
    groupActionId: groupAction,
    botId: bot.id,
  });
  return res.send({status: 1, result: {action}});
};

const updateAction = async (req, res) => {
  const {id} = req.params;
  const {name, actions, groupAction} = req.body;
  const {bot} = req;
  const action = await actionService.updateAction({
    id,
    name,
    actions,
    groupActionId: groupAction,
    botId: bot.id,
  });
  return res.send({status: 1, result: {action}});
};

const deleteAction = async (req, res) => {
  const {id} = req.params;
  await actionService.deleteAction(id);
  return res.send({status: 1});
};

module.exports = {
  getAllActionByBotId,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
};
