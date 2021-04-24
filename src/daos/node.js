const Node = require('../models/node');
const { findByCondition } = require('../utils/db');

const create = async (data) => {
  const node = await Node.create(data);
  return node;
};

const update = async (id, data) => {
  const node = await Node.findByIdAndUpdate(id, data);
  return node;
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
              select: 'name _id',
            },
            {
              path: 'response.actionBreak',
              model: 'Action',
              select: 'name _id',
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
              select: 'name _id',
            },
            {
              path: 'response.actionBreak',
              model: 'Action',
              select: 'name _id',
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
  create,
  update,
  findNodeById,
  findNodeIntentStartFlow,
};
