const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const intentDao = require('../daos/intent');
const groupIntentDao = require('../daos/groupIntent');
const Intent = require('../models/intent');

const createIntent = async ({ data, groupIntentId, botId }) => {
  const intentExist = await intentDao.findIntentByName({ name: data.name });
  if (intentExist) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  }
  const intent = await intentDao.createIntent(data);
  if (!groupIntentId) {
    await groupIntentDao.createGroupIntent({
      botId,
      isGroup: false,
      intentId: [intent.id],
    });
  } else {
    await groupIntentDao.addIntentInGroup(groupIntentId, intent.id);
  }
  return intent;
};

const updateIntent = async (id, data, groupIntentId) => {
  const intentNameExist = await intentDao.findIntentByName({
    name: data.name,
  });
  if (intentNameExist && intentNameExist.id !== id) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  }
  const intent = await intentDao.updateIntent(id, data);
  if (groupIntentId !== null) {
    await groupIntentDao.removeIntentInGroup(groupIntentId, id);
    await groupIntentDao.addIntentInGroup(groupIntentId, id);
  }
  return intent;
};

const updatePatternOfIntent = async ({ id, pattern }) => {
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  if (intent.patterns.includes(pattern)) {
    throw new CustomError(errorCodes.PATTERN_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  return intent;
};

// const findIntentByUserId = async (userId) => {
//   const createBy = userId;
//   const intent = await intentnDao.findIntent(createBy);
//   return intent;
// };

const findIntentById = async (id) => {
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  return intent;
};

const deleteIntentById = async (id) => {
  await intentDao.deleteIntent(id);
};

const removeUsersayOfIntent = async (id, pattern) => {
  console.log(pattern);
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  const { patterns } = intent;
  const index = patterns.indexOf(pattern);
  if (index < 1) {
    throw new CustomError(errorCodes.PATTERN_NOT_FOUND);
  }
  const newPatterns = patterns.filter((item) => item !== pattern);
  intent.patterns = newPatterns;
  await intentDao.updateIntent(id, intent);
  return intent;
};

const addUsersayOfIntent = async (id, pattern) => {
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  return intent;
};

const addParameterOfIntent = async (id, parameter) => {
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  intent.parameters.map((item) => {
    if (item.name === parameter.name) {
      throw new CustomError(errorCodes.PARAMETER_EXISTED);
    }
  });
  intent.parameters.push(parameter);
  await intentDao.updateIntent(id, intent);
  return intent;
};

const removeParameterOfIntent = async (id, parameter) => {
  const intent = await intentDao.findIntentById(id);
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  const { length } = intent.parameters;
  intent.parameters = intent.parameters.filter(
    (item) => item.name !== parameter.name,
  );
  if (length === intent.parameters.length) {
    throw new CustomError(errorCodes.PARAMETER_NOT_EXIST);
  }
  await intentDao.updateIntent(id, intent);
  return intent;
};

module.exports = {
  createIntent,
  updateIntent,
  updatePatternOfIntent,
  //  findIntentByUserId,
  findIntentById,
  deleteIntentById,
  addUsersayOfIntent,
  removeUsersayOfIntent,
  addParameterOfIntent,
  removeParameterOfIntent,
};
