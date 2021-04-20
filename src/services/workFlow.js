const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workflowDao = require('../daos/workflow');
const conditionDao = require('../daos/condition');

const findAllWorkflowByBotId = async ({ botId, keyword }) => {
  const { data } = await workflowDao.findAllWorkflowByCondition({
    key: keyword,
    searchFields: ['name'],
    query: {
      bot: botId,
    },
  });

  return data;
};

const findWorkflowById = async (id) => {
  const workflow = await workflowDao.findWorkflowByCondition({ _id: id });
  if (!workflow) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return workflow;
};

const findById = async (id) => {
  const workFlow = await workflowDao.findWorkflowByCondition(
    {
      _id: id,
    },
    null,
    [
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
  );
  if (!workFlow) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  return workFlow;
};

const createWorkflow = async ({
  name,
  nodes,
  userId,
  groupWorkflowId,
  botId,
}) => {
  const workflowExist = await workflowDao.findWorkflowByCondition({
    name,
    bot: botId,
  });
  if (workflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const Workflow = await workflowDao.createWorkflow({
    name,
    nodes,
    userId,
    groupWorkflowId,
    botId,
  });

  return Workflow;
};

const updateWorkflow = async ({ id, name, nodes, groupWorkflowId, botId }) => {
  const workflowExist = await workflowDao.findWorkflowByCondition({
    _id: { $ne: id },
    name,
    bot: botId,
  });
  if (workflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const workflow = await workflowDao.updateWorkflow(id, {
    name,
    nodes,
    groupWorkflow: groupWorkflowId,
  });

  return workflow;
};

const updateNodes = async (id, data) => {
  const workflow = await workflowDao.updateWorkflow(id, data);
  return workflow;
};

const deleteWorkflow = async (id) => {
  await workflowDao.deleteWorkflow(id);
};
const addNode = async (id, data) => {
  if (data.type === 'CONDITION') {
    const dataCondition = {
      operator: 'and',
      conditions: [],
    };
    const condition = await conditionDao.createCondition(dataCondition);
    data.condition = condition._id;
  }
  const node = await workflowDao.addNode(id, data);
  return node;
};

const removeNode = async (id, nodeId) => {
  await workflowDao.removeNode(id, nodeId);
};

module.exports = {
  findAllWorkflowByBotId,
  findWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addNode,
  findById,
  removeNode,
  updateNodes,
};
