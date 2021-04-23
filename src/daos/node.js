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

const updateManyNode = async (data) => {
  const node = await Node.updateMany({}, data);
  return node;
};

const deleteNode = async (id) => {
  await Node.findByIdAndDelete(id);
};

const deleteNodeConnect = async (workflowId, nodeId) => {
  await Node.updateMany(
    { workflow: workflowId },
    {
      $pull: {
        $or: [{ children: { node: nodeId } }, { parent: { node: nodeId } }],
      },
    },
  );
};

module.exports = {
  findNodeByCondition,
  createNode,
  updateNode,
  updateManyNode,
  deleteNode,
  deleteNodeConnect,
};
