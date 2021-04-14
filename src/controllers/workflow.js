const workflowService = require('../services/workflow');

const getAllWorkflowByBotId = async (req, res) => {
  const { bot } = req;
  const { keyword } = req.query;
  const workflows = await workflowService.findAllWorkflowByBotId({
    keyword,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { workflows } });
};

const getWorkflowById = async (req, res) => {
  const { id } = req.params;
  const workflow = await workflowService.findWorkflowById(id);
  return res.send({ status: 1, result: { workflow } });
};

const createWorkflow = async (req, res) => {
  const { bot, user } = req;
  const { name, groupWorkflow, nodes } = req.body;
  const workflow = await workflowService.createWorkflow({
    name,
    nodes,
    userId: user.id,
    groupWorkflowId: groupWorkflow,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { workflow } });
};

const updateWorkflow = async (req, res) => {
  const { id } = req.params;
  const { name, nodes, groupWorkflow } = req.body;
  const { bot } = req;
  const workflow = await workflowService.updateWorkflow({
    id,
    name,
    nodes,
    groupWorkflowId: groupWorkflow,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { workflow } });
};

const deleteWorkflow = async (req, res) => {
  const { id } = req.params;
  await workflowService.deleteWorkflow(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllWorkflowByBotId,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
