const Node = require('../models/node');
const { findByCondition } = require('../utils/db');

const findNodeByCondition = async (condition) => {
  const node = await findByCondition(Node, condition);
  return node;
};

const createNode = async (data) => {
  const node = await Node.create(data);
  return node;
};

const updateNode = async (id, data) => {
  const node = await Node.findByIdAndUpdate(id, data, { new: true });
  return node;
};

const pushNodeToChildren = async (id, data) => {
  const node = await Node.findByIdAndUpdate(id, {
    $push: {
      children: data,
    },
  });
  return node;
};

const deleteNode = async (id) => {
  await Node.findByIdAndDelete(id);
};

const deleteNodeConnect = async (workflowId, nodeId) => {
  console.log(workflowId, nodeId);
  await Node.update(
    { workflow: workflowId },
    {
      $pull: {
        $or: [{ children: { node: nodeId } }, { parent: { node: nodeId } }],
      },
    },
    {
      multi: true,
    },
  );
};

const findNodeIntentStartFlow = async (botId, intentId) => {
  console.time();
  const node = await Node.find({
    'parent.type': 'START',
    type: 'INTENT',
    intent: intentId,
  }).populate([
    {
      path: 'intent',
      model: 'Intent',
    },
    {
      path: 'node',
      model: 'Node',
    },
  ]);
  console.timeEnd();
  return node;
};

const findParameters = async (data) => {
  const nodes = await Node.find({
    _id: { $in: data },
  }).populate([
    {
      path: 'intent',
      model: 'Intent',
    },
  ]);
  return nodes;
};

module.exports = {
  findNodeByCondition,
  createNode,
  updateNode,
  pushNodeToChildren,
  deleteNode,
  deleteNodeConnect,
  findNodeIntentStartFlow,
  findParameters,
};
