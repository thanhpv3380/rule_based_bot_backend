const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const nodeDao = require('../daos/node');
const conditionDao = require('../daos/condition');

const findNodeById = async (id) => {
  const node = await nodeDao.findNodeByCondition({ _id: id });
  if (!node) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return node;
};

const createNode = async (data) => {
  if (data && data.type === 'CONDITION') {
    const dataCondition = {
      operator: 'and',
      conditions: [],
    };
    const condition = await conditionDao.createCondition(dataCondition);
    data.condition = condition._id;
  }
  const node = await nodeDao.createNode(data);
  return node;
};

const updateNode = async (id, data) => {
  await findNodeById(id);
  const node = await nodeDao.updateNode(id, data);
  return node;
};

const deleteNode = async (workflowId, nodeId) => {
  await nodeDao.deleteNode(nodeId);
  await nodeDao.deleteNodeConnect(workflowId, nodeId);
};

module.exports = {
  findNodeById,
  createNode,
  updateNode,
  deleteNode,
};
