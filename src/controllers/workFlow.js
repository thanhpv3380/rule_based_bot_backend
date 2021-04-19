const {
  Types: { ObjectId },
} = require('mongoose');
const workFlowService = require('../services/workFlow');

const create = async (req, res) => {
  const { user, bot } = req;
  const { name, nodes } = req.body;
  const data = {
    name,
    nodes,
    bot: bot.id,
    createBy: user.id,
  };
  const workFlow = await workFlowService.createWorkFlow(data);
  return res.send({ status: 1, result: workFlow });
};

const update = async (req, res) => {
  const { name, nodes } = req.body;
  const { id } = req.params;
  const data = {
    name,
    nodes,
  };
  const workFlow = await workFlowService.updateWorkFlow(id, data);
  return res.send({ status: 1, result: workFlow });
};

const updateNodes = async (req, res) => {
  const { nodes } = req.body;
  const { id } = req.params;
  console.log(nodes);
  const data = {
    nodes: nodes.map((el) => {
      return {
        _id: ObjectId(el.id),
        type: el.type,
        parent: el.parent,
        position: el.position,
        intent: el.intent,
        action: el.action,
        condition: el.condition,
      };
    }),
  };
  const workFlow = await workFlowService.updateWorkFlow(id, data);
  return res.send({ status: 1, result: workFlow });
};

const addNode = async (req, res) => {
  const { node } = req.body;
  const { id } = req.params;
  const newNode = await workFlowService.addNode(id, node);
  return res.send({ status: 1, result: { node: newNode } });
};

const removeNode = async (req, res) => {
  const { nodeId } = req.body;
  const { id } = req.params;
  await workFlowService.removeNode(id, nodeId);
  return res.send({ status: 1 });
};

const getWorkFlowById = async (req, res) => {
  const { bot } = req;
  const { id } = req.params;
  const workFlow = await workFlowService.findById(id, bot.id);
  return res.send({ status: 1, result: workFlow });
};

module.exports = {
  create,
  update,
  updateNodes,
  addNode,
  removeNode,
  getWorkFlowById,
};
