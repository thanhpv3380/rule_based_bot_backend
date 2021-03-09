/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const groupIntentDao = require('../daos/groupIntent');
const intentDao = require('../daos/intent');

// const findAllGroupAndItem = async ({ botId, keyword }) => {
//   const groupIntents = await groupIntentDao.findAllGroupAndItem({
//     botId,
//     keyword,
//   });
//   const response = await groupIntents.filter(
//     (item) => item.intents.length !== 0,
//   );
//   return { groupIntents: response, metadata: { total: response.length } };
// };

const findAllGroupAndItem = async (keyword, botId) => {
  const { data } = await groupIntentDao.findAllGroupAndItem({
    query: {
      bot: botId,
    },
  });
  const groupIntents = [];
  for (const el in data) {
    const result = await intentDao.findAllIntentByGroupIntentId({
      key: keyword,
      searchFields: ['name'],
      query: {
        groupIntent: data[el]._id,
      },
      fields: ['id', 'name', 'createBy', 'groupIntent'],
    });

    groupIntents.push({
      ...data[el],
      intents: result.data,
    });
  }
  if (keyword === '' || !keyword || keyword === null) {
    return groupIntents;
  }
  const filterGroupIntents = groupIntents.filter(
    (item) => item.intents.length !== 0,
  );
  return filterGroupIntents;
};

const findAllGroupIntent = async (
  bot,
  key,
  searchFields,
  limit,
  offset,
  fields,
  sort,
  query,
) => {
  const newSearchFields = searchFields ? searchFields.split(',') : null;
  const newFields = fields ? fields.split(',') : null;
  const { data, metadata } = await groupIntentDao.findAllGroupAndItem({
    key,
    searchFields: newSearchFields,
    query: { ...query, bot },
    offset,
    limit,
    fields: newFields,
    sort,
  });

  return { groupIntents: data, metadata };
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
  if (groupIntentExists && groupIntentExists.id !== id) {
    throw new CustomError(errorCodes.GROUP_INTENT_EXIST);
  }
  const groupIntent = await groupIntentDao.updateGroupIntent({ id, name });
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await intentDao.deleteIntentByGroupId(id);
  await groupIntentDao.deleteGroupIntent(id);
};

module.exports = {
  findAllGroupIntent,
  findAllGroupAndItem,
  findGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
