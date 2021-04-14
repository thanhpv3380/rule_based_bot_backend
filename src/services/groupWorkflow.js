/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { GROUP } = require('../constants/index');
const groupWorkflowDao = require('../daos/groupWorkflow');

const findAllGroupWorkflowAndItem = async ({ keyword, botId }) => {
  const groupWorkflows = await groupWorkflowDao.findAllGroupWorkflowAndItem({
    keyword,
    botId,
  });
  return groupWorkflows;
};

const findGroupWorkflowById = async (id) => {
  const groupWorkflow = await groupWorkflowDao.findGroupWorkflowByCondition({
    _id: id,
  });
  if (!groupWorkflow) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return groupWorkflow;
};

const createGroupWorkflow = async ({ name, botId }) => {
  const groupWorkflowExist = await groupWorkflowDao.findGroupWorkflowByCondition(
    {
      name,
      bot: botId,
    },
  );
  if (groupWorkflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const groupWorkflow = await groupWorkflowDao.createGroupWorkflow({
    name,
    botId,
    groupType: GROUP,
  });
  return groupWorkflow;
};

const updateGroupWorkflow = async ({ id, botId, name }) => {
  let groupWorkflowExist = await groupWorkflowDao.findGroupWorkflowByCondition({
    _id: id,
  });
  if (!groupWorkflowExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  groupWorkflowExist = await groupWorkflowDao.findGroupWorkflowByCondition({
    _id: { $ne: id },
    name,
    bot: botId,
  });
  if (groupWorkflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const groupWorkflow = await groupWorkflowDao.updateGroupWorkflow(id, {
    name,
  });
  return groupWorkflow;
};

const deleteGroupWorkflow = async (id) => {
  await groupWorkflowDao.deleteGroupWorkflow(id);
};

module.exports = {
  findAllGroupWorkflowAndItem,
  findGroupWorkflowById,
  createGroupWorkflow,
  updateGroupWorkflow,
  deleteGroupWorkflow,
};
