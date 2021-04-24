const nodeService = require('../services/node');

const getNodeById = async (req, res) => {
  const { id } = req.params;
  const node = await nodeService.findNodeById(id);
  return res.send({ status: 1, result: { node } });
};

const createNode = async (req, res) => {
  const { bot } = req;
  const data = req.body;
  const node = await nodeService.createNode({
    ...data,
    bot: bot.id,
  });
  return res.send({ status: 1, result: { node } });
};

const updateNode = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const node = await nodeService.updateNode(id, data);
  return res.send({ status: 1, result: { node } });
};

const deleteNode = async (req, res) => {
  const { nodeId, workflowId } = req.params;
  await nodeService.deleteNode(workflowId, nodeId);
  return res.send({ status: 1 });
};

const getParameters = async (req, res) => {
  const { nodes } = req.body;
  const parameters = await nodeService.findParameters(nodes);
  res.send({ status: 1, result: { parameters } });
};

module.exports = {
  getNodeById,
  createNode,
  updateNode,
  deleteNode,
  getParameters,
};
