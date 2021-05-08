const {
  Types: { ObjectId },
} = require('mongoose');
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

// const deleteNodeConnect = async (workflowId, nodeId) => {
//   await Node.update(
//     { workflow: ObjectId(workflowId) },
//     {
//       $pull: {
//         $or: [
//           { children: { node: ObjectId(nodeId) } },
//           { parent: { node: ObjectId(nodeId) } },
//         ],
//       },
//     },
//     {
//       multi: true,
//     },
//   );
// };

const deleteNodeConnect = async (workflowId, data) => {
  await Node.update({ workflow: ObjectId(workflowId) }, data, {
    multi: true,
  });
};

const findNodeIntentStartFlow = async (botId, intentId) => {
  const node = await Node.find({
    'parent.type': 'START',
    type: 'INTENT',
    intent: intentId,
  }).populate([
    {
      path: 'intent',
      model: 'Intent',
      populate: [
        {
          path: 'mappingAction',
          select: 'name _id',
        },
        {
          path: 'parameters',
          populate: [
            {
              path: 'entity',
            },
            {
              path: 'response.actionAskAgain',
              model: 'Action',
            },
            {
              path: 'response.actionBreak',
              model: 'Action',
            },
          ],
        },
      ],
    },
    {
      path: 'children.node',
      model: 'Node',
    },
  ]);
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

const findNodeById = async (id) => {
  const workflow = await findByCondition(Node, { _id: id }, null, [
    {
      path: 'intent',
      model: 'Intent',
      populate: [
        {
          path: 'mappingAction',
          model: 'Action',
        },
        {
          path: 'parameters',
          populate: [
            {
              path: 'entity',
            },
            {
              path: 'response.actionAskAgain',
              model: 'Action',
            },
            {
              path: 'response.actionBreak',
              model: 'Action',
            },
          ],
        },
      ],
    },
    {
      path: 'condition',
      model: 'Condition',
    },
    {
      path: 'action',
      model: 'Action',
    },
    {
      path: 'children.node',
      model: 'Node',
    },
  ]);
  return workflow;
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
  findNodeById,
};
