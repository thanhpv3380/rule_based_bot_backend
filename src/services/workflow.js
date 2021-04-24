const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workflowDao = require('../daos/workflow');
const conditionDao = require('../daos/condition');
const nodeDao = require('../daos/node');
const {
  Types: { ObjectId },
} = require('mongoose');

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
  const workflow = await workflowDao.findWorkflowAndItem(id);
  return workflow;
};

const findWorkflowByIdTest = async (id) => {
  const workflow = await workflowDao.findWorkflowByCondition(
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
  if (!workflow) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return workflow;
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

const updateWorkflow = async (id, data, botId) => {
  const params = data;

  for (const prop in params) {
    if (Array.isArray(params[prop])) {
      if (params[prop].length <= 0) delete params[prop];
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!params[prop]) delete params[prop];
    }
  }

  if (params && params.name) {
    const workflowExist = await workflowDao.findWorkflowByCondition({
      _id: { $ne: id },
      name: data.name,
      bot: botId,
    });
    if (workflowExist) {
      throw new CustomError(errorCodes.ITEM_NAME_EXIST);
    }
  }
  // if (params && params.nodes) {
  //   params.nodes.map(async (el) => {
  //     el.workflow = id;
  //     el._id = ObjectId(el.id);
  //     await nodeDao.create(el);
  //   });
  // }

  const workflow = await workflowDao.updateWorkflow(id, params);
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

const removeNode = async (id, nodeId, type) => {
  if (type === 'CONDITION') {
    const workflow = await workflowDao.findWorkflowByCondition({ _id: id });
    if (!workflow) {
      throw new CustomError(errorCodes.NOT_FOUND);
    }
    const item = workflow.nodes.find((el) => el._id === nodeId);
    await conditionDao.deleteCondition(item._id);
  }
  await workflowDao.removeNode(id, nodeId);
};

module.exports = {
  findAllWorkflowByBotId,
  findWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addNode,
  removeNode,
};
