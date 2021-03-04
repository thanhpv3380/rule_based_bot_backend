const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const groupIntentDao = require('../daos/groupIntent');

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

const findAllGroupAndItem = async (
  botId,
  keyword,
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
    query: { ...query, bot: botId },
    offset,
    limit,
    fields: newFields,
    sort,
    populate: [
      {
        path: 'intents',
        match: { name: { $regex: keyword } },
        select: 'name id',
      },
    ],
  });
  const groupIntents = data.filter((item) => item.intents.length !== 0);

  return { groupIntents, metadata };
};

// const findAllGroupIntent = async (botId) => {
//   const groupIntents = await groupIntentDao.findAllGroupAndItem({
//     botId,
//     keyword: '',
//   });
//   return { groupIntents, metadata: { total: groupIntents.length } };
// };

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
    populate: ['intents'],
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
  findAllGroupAndItem,
  findGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
