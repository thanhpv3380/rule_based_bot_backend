const Node = require('../models/node');

const create = async (data) => {
  const node = await Node.create(data);
  return node;
};

const update = async (id, data) => {
  const node = await Node.findByIdAndUpdate(id, data);
  return node;
};

module.exports = {
  create,
  update,
};
