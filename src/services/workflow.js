const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workflowDao = require('../daos/workflow');
const nodeDao = require('../daos/node');

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

const createWorkflow = async ({ name, userId, groupWorkflowId, botId }) => {
  const workflowExist = await workflowDao.findWorkflowByCondition({
    name,
    bot: botId,
  });
  if (workflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const workflow = await workflowDao.createWorkflow({
    name,
    createBy: userId,
    groupWorkflow: groupWorkflowId,
    bot: botId,
    zoom: 100,
    offsetX: 0,
    offsetY: 0,
  });
  await nodeDao.createNode({
    type: 'START',
    children: [],
    position: {
      x: 80,
      y: 60,
    },
    workflow: workflow._id,
    parent: [],
  });
  return workflow;
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
  if (params && params.nodes) {
    await Promise.all(
      params.nodes.map(async (el) => {
        const nodeId = el.id;
        delete el.id;
        const node = await nodeDao.updateNode(nodeId, el);
        return node;
      }),
    );
    delete params.nodes;
  }
  const workflow = await workflowDao.updateWorkflow(id, params);
  return workflow;
};

const deleteWorkflow = async (id) => {
  await workflowDao.deleteWorkflow(id);
};

module.exports = {
  findAllWorkflowByBotId,
  findWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
