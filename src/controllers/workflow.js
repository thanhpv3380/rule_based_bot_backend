const {
  Types: { ObjectId },
} = require('mongoose');
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
  const workflow = await workflowService.findById(id);
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

const updateNodes = async (req, res) => {
  const { nodes, offsetX, offsetY, zoom } = req.body;
  const { id } = req.params;
  const data = {
    offsetX,
    offsetY,
    zoom,
    nodes: nodes.map((el) => {
      return {
        _id: ObjectId(el.id),
        type: el.type,
        parent: el.parent,
        children: el.children,
        position: el.position,
        intent: el.intent,
        action: el.action,
        condition: el.condition,
      };
    }),
  };
  const workFlow = await workflowService.updateNodes(id, data);
  return res.send({ status: 1, result: workFlow });
};

const addNode = async (req, res) => {
  const { node } = req.body;
  const { id } = req.params;
  const newNode = await workflowService.addNode(id, node);
  return res.send({ status: 1, result: { node: newNode } });
};

const removeNode = async (req, res) => {
  const { nodeId } = req.body;
  const { id } = req.params;
  await workflowService.removeNode(id, nodeId);
  return res.send({ status: 1 });
};

module.exports = {
  getAllWorkflowByBotId,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addNode,
  removeNode,
  updateNodes,
};
