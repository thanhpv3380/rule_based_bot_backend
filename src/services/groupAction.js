/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const {GROUP} = require('../constants/index');
const groupActionDao = require('../daos/groupAction');

const findAllGroupActionAndItem = async ({keyword, botId}) => {
  const groupActions = await groupActionDao.findAllGroupActionAndItem({
    keyword,
    botId,
  });
  return groupActions;
};

const findGroupActionById = async (id) => {
  const groupAction = await groupActionDao.findGroupActionByCondition({
    _id: id,
  });
  if (!groupAction) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return groupAction;
};

const createGroupAction = async ({name, botId}) => {
  const groupActionExist = await groupActionDao.findGroupActionByCondition({
    name,
    bot: botId,
  });
  if (groupActionExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const groupAction = await groupActionDao.createGroupAction({
    name,
    botId,
    groupType: GROUP,
  });
  return groupAction;
};

const updateGroupAction = async ({id, botId, name}) => {
  let groupActionExist = await groupActionDao.findGroupActionByCondition({
    _id: id,
  });
  if (!groupActionExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  groupActionExist = await groupActionDao.findGroupActionByCondition({
    _id: {$ne: id},
    name,
    bot: botId,
  });
  if (groupActionExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const groupAction = await groupActionDao.updateGroupAction(id, {name});
  return groupAction;
};

const deleteGroupAction = async (id) => {
  await groupActionDao.deleteGroupAction(id);
};

module.exports = {
  findAllGroupActionAndItem,
  findGroupActionById,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
