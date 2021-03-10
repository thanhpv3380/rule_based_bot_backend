/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { GROUP } = require('../constants/index');
const groupIntentDao = require('../daos/groupIntent');
const intentDao = require('../daos/intent');

const findAllGroupIntentAndItem = async ({ keyword, botId }) => {
  const { data } = await groupIntentDao.findAllGroupIntentAndItem({
    query: {
      bot: botId,
    },
  });
  const groupIntents = [];
  for (const el in data) {
    const result = await intentDao.findAllIntentByCondition({
      key: keyword,
      searchFields: ['name'],
      query: {
        groupIntent: data[el].id,
      },
      fields: ['id', 'name', 'createBy', 'groupIntent'],
    });

    groupIntents.push({
      ...data[el],
      children: result.data,
    });
  }

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

const createGroupIntent = async ({ name, botId }) => {
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

const updateGroupIntent = async ({ id, botId, name }) => {
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

  const groupIntent = await groupIntentDao.updateGroupIntent(id, { name });
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
