const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workFlowDao = require('../daos/workFlow');
const conditionDao = require('../daos/condition');

const createWorkFlow = async (data) => {
  const workFlow = await workFlowDao.createWorkFlow(data);
  return workFlow;
};

const updateWorkFlow = async (id, data) => {
  const workFlowExist = await workFlowDao.findWorkFlowByCondition({
    condition: { name: data.name },
  });
  if (workFlowExist) {
    throw new CustomError(errorCodes.ITEM_NAME_EXIST);
  }
  const workFlow = await workFlowDao.updateWorkFlow(id, data);
  return workFlow;
};

const findById = async (id, botId) => {
  const workFlow = await workFlowDao.findWorkFlowByCondition({
    condition: {
      bot: botId,
      _id: id,
    },
    populate: [
      {
        path: 'nodes',
        populate: [
          {
            path: 'intent',
            model: 'Intent',
            select: 'name _id',
          },
          {
            path: 'action',
            model: 'Action',
            select: 'name _id',
          },
          {
            path: 'condition',
            model: 'Condition',
            select: 'name _id',
          },
        ],
      },
      {
        path: 'bot',
        model: 'Bot',
      },
      {
        path: 'createBy',
        model: 'User',
        select: 'name _id',
      },
    ],
  });
  if (!workFlow) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  return workFlow;
};

const addNode = async (id, data) => {
  const node = await workFlowDao.addNode(id, data);
  if (data.type === 'CONDITION') {
    const dataCondition = {
      operator: 'and',
      conditions: [],
    };
    const condition = await conditionDao.createCondition(dataCondition);
    node.condition = condition.id;
  }
  return node;
};

const removeNode = async (id, nodeId) => {
  await workFlowDao.removeNode(id, nodeId);
};

module.exports = {
  createWorkFlow,
  updateWorkFlow,
  addNode,
  findById,
  removeNode,
};
