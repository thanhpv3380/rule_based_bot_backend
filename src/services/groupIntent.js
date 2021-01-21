const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const groupIntentDao = require('../daos/groupIntent');

const findAllGroupIntent = async (id) => {
  const groupIntents = await groupIntentDao.findAllGroupIntent(id);
  return { groupIntents, metadata: { total: groupIntents.length } };
};

const findAllGroupIntentAndItem = async ({ keyword, botId }) => {
  const data = await groupIntentDao.findAllGroupIntentAndItem({
    keyword,
    botId,
  });
  return data;
};

const findGroupIntentById = async ({ id, fields }) => {
  const groupIntent = await groupIntentDao.findGroupIntentById({ id, fields });
  if (!groupIntent) {
    throw new CustomError(errorCodes.GROUP_INTENT_NOT_EXIST);
  }
  return groupIntent;
};

const createGroupIntent = async ({ name, botId }) => {
  const groupIntentExists = await groupIntentDao.findGroupIntentByName({
    name,
  });
  if (groupIntentExists) {
    throw new CustomError(errorCodes.GROUP_INTENT_EXIST);
  }
  const groupIntent = await groupIntentDao.createGroupIntent({
    name,
    botId,
    isGroup: true,
  });
  return groupIntent;
};

const updateGroupIntent = async ({ id, name }) => {
  const groupIntentExists = await groupIntentDao.findGroupIntentByName({
    name,
  });
  if (groupIntentExists.id !== id) {
    throw new CustomError(errorCodes.GROUP_INTENT_EXIST);
  }
  const groupIntent = await groupIntentDao.updateGroupIntent({ id, name });
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await groupIntentDao.deleteGroupIntent(id);
};

module.exports = {
  findAllGroupIntent,
  findAllGroupIntentAndItem,
  findGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};