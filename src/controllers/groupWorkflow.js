const groupWorkflowService = require('../services/groupWorkflow');

const getAllGroupWorkflowAndItem = async (req, res) => {
  const { keyword } = req.body;
  const { bot } = req;
  const groupWorkflows = await groupWorkflowService.findAllGroupWorkflowAndItem(
    {
      keyword,
      botId: bot.id,
    },
  );
  return res.send({ status: 1, result: { groupWorkflows } });
};

const getGroupWorkflowById = async (req, res) => {
  const { id } = req.params;
  const groupWorkflow = await groupWorkflowService.findGroupWorkflowById(id);
  return res.send({ status: 1, result: { groupWorkflow } });
};

const createGroupWorkflow = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupWorkflow = await groupWorkflowService.createGroupWorkflow({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupWorkflow } });
};

const updateGroupWorkflow = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { bot } = req;
  const groupWorkflow = await groupWorkflowService.updateGroupWorkflow({
    id,
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupWorkflow } });
};

const deleteGroupWorkflow = async (req, res) => {
  const { id } = req.params;
  await groupWorkflowService.deleteGroupWorkflow(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupWorkflowAndItem,
  getGroupWorkflowById,
  createGroupWorkflow,
  updateGroupWorkflow,
  deleteGroupWorkflow,
};
