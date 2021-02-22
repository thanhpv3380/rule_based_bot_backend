const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const groupActionDao = require('../daos/groupAction');

const findAllGroupAction = async (id) => {
  const groupActions = await groupActionDao.findAllGroupAction(id);
  return { groupActions, metadata: { total: groupActions.length } };
};

const findAllGroupActionAndItem = async ({ keyword, botId }) => {
  const data = await groupActionDao.findAllGroupActionAndItem({
    keyword,
    botId,
  });
  return data;
};

const findGroupActionById = async ({ id, fields }) => {
  const groupAction = await groupActionDao.findGroupActionById({ id, fields });
  if (!groupAction) {
    throw new CustomError(errorCodes.GROUP_ACTION_NOT_EXIST);
  }
  return groupAction;
};

const createGroupAction = async ({ name, botId }) => {
  const groupActionExists = await groupActionDao.findGroupActionByName({
    name,
  });
  if (groupActionExists) {
    throw new CustomError(errorCodes.GROUP_ACTION_EXIST);
  }
  const groupAction = await groupActionDao.createGroupAction({
    name,
    botId,
    isGroup: true,
  });
  return groupAction;
};

const updateGroupAction = async ({ id, name }) => {
  const groupActionExists = await groupActionDao.findGroupActionByName({
    name,
  });
  if (groupActionExists.id !== id) {
    throw new CustomError(errorCodes.GROUP_ACTION_EXIST);
  }
  const groupAction = await groupActionDao.updateGroupAction({ id, name });
  return groupAction;
};

const deleteGroupAction = async (id) => {
  await groupActionDao.deleteGroupAction(id);
};

module.exports = {
  findAllGroupAction,
  findAllGroupActionAndItem,
  findGroupActionById,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
