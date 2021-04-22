const intent = require('../models/intent');
const Node = require('../models/node');

const create = async (data) => {
  const node = await Node.create(data);
  return node;
};

const update = async (id, data) => {
  const node = await Node.findByIdAndUpdate(id, data);
  return node;
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

module.exports = {
  create,
  update,
  findNodeIntentStartFlow,
};
