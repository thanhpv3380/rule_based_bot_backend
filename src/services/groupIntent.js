const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const groupIntentDao = require('../daos/groupIntent');
const intentDao = require('../daos/intent');

const findAllGroupIntent = async (id) => {
  // const groupIntents = await groupIntentDao.findAllGroupIntent());
  // const response = groupIntents.map(item => {
  //   const intents = intentDao.findAllIntentOfGroup(item.intents);
  //   return {
  //     name: item.name,
  //     intents: intents,
  //     isGroup: item.isGroup,
  //     updatedAt: item.updatedAt,
  //     createdAt: item.createdAt
  //   };
  // })
  const response = {};
  const getGroupIntents = new Promise(async (resolve, reject) => {
    const groupIntents = await groupIntentDao.findAllGroupIntent();
    resolve(groupIntents);
  });
  await getGroupIntents.then((groupIntents) => {
    console.log(groupIntents, "result");
    // response = groupIntents.map((item) => {
    //   const intents = intentDao.findAllIntentOfGroup(item.intents);
    //   return {
    //     name: item.name,
    //     intents: intents,
    //     isGroup: item.isGroup,
    //     updatedAt: item.updatedAt,
    //     createdAt: item.createdAt,
    //   };
    // });
  });
  return { groupIntents: response, metadata: { total: response.length } };
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
