const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workflowDao = require('../daos/workflow');

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
