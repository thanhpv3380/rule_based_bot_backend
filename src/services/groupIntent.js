/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const {GROUP} = require('../constants/index');
const groupIntentDao = require('../daos/groupIntent');

const findAllGroupIntentAndItem = async ({keyword, botId}) => {
  const groupIntents = await groupIntentDao.findAllGroupIntentAndItem({
    keyword,
    botId,
  });

  return groupIntents;
};

const findGroupIntentById = async (id) => {
  const groupIntent = await groupIntentDao.findGroupIntentByCondition({
    _id: id,
  });
  if (!groupIntent) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return groupIntent;
};

const createGroupIntent = async ({name, botId}) => {
  const groupIntentExist = await groupIntentDao.findGroupIntentByCondition({
    name,
    bot: botId,
  });
  if (groupIntentExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const groupIntent = await groupIntentDao.createGroupIntent({
    name,
    botId,
    groupType: GROUP,
  });
  return groupIntent;
};

const updateGroupIntent = async ({id, botId, name}) => {
  let groupIntentExist = await groupIntentDao.findGroupIntentByCondition({
    _id: id,
  });
  if (!groupIntentExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  groupIntentExist = await groupIntentDao.findGroupIntentByCondition({
    name,
    bot: botId,
  });
  if (groupIntentExist) {
    if (groupIntentExist.id !== id) {
      throw new CustomError(errorCodes.ITEM_EXIST);
    } else {
      throw new CustomError(errorCodes.ITEM_NOT_CHANGE);
    }
  }

  const groupIntent = await groupIntentDao.updateGroupIntent(id, {name});
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await groupIntentDao.deleteGroupIntent(id);
};

module.exports = {
  findAllGroupIntentAndItem,
  findGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
