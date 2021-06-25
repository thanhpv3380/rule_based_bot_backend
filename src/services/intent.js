const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const intentDao = require('../daos/intent');
const nodeDao = require('../daos/node');
const intentES = require('../elasticsearch/intent');

const findAllActionByBotId = async ({ botId, fields, sort }) => {
  const newFields = fields.split(',');
  const newSort = sort.split(',');
  const { data } = await intentDao.findAllIntentByCondition({
    fields: newFields,
    sort: newSort,
    query: {
      bot: botId,
    },
  });

  return data;
};

const createIntent = async ({ data }) => {
  const intentExist = await intentDao.findIntentByCondition({
    condition: { name: data.name, bot: data.bot },
  });
  if (intentExist) {
    throw new CustomError(errorCodes.ITEM_NAME_EXIST);
  }
  const intent = await intentDao.createIntent(data);
  await intentES.createIntent(intent);
  return intent;
};

const updateIntent = async (id, botId, data) => {
  const intentNameExist = await intentDao.findIntentByCondition({
    condition: { name: data.name, bot: botId },
  });
  if (intentNameExist && intentNameExist._id.toString() !== id) {
    throw new CustomError(errorCodes.ITEM_NAME_EXIST);
  }
  const intent = await intentDao.updateIntent(id, data);
  await intentES.updateIntent(intent);
  return intent;
};

const updatePatternOfIntent = async ({ id, pattern }) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  if (intent.patterns.includes(pattern)) {
    throw new CustomError(errorCodes.PATTERN_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  await intentES.updateIntent(intent);
  return intent;
};

const findIntentById = async (id) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
    populate: [
      {
        path: 'mappingAction',
        select: 'name _id',
      },
      {
        path: 'parameters',
        populate: [
          {
            path: 'entity',
            select: 'name _id',
          },
          {
            path: 'response.actionAskAgain',
            model: 'Action',
            select: 'name _id',
          },
          {
            path: 'response.actionBreak',
            model: 'Action',
            select: 'name _id',
          },
        ],
      },
    ],
  });
  if (!intent) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  return intent;
};

const findIntentByBotId = async (botId) => {
  const { data } = await intentDao.findAllIntentByCondition({
    query: { bot: botId },
    sort: ['name_desc'],
  });
  return data;
};

const deleteIntentById = async (id) => {
  const node = await nodeDao.findNodeByCondition({ intent: id });
  if (node) {
    throw CustomError(errorCodes.ITEM_EXIST_IN_WORKFLOW);
  }
  await intentDao.deleteIntent(id);
  await intentES.deleteIntentById(id);
};

const removeUsersayOfIntent = async (id, pattern) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  const { patterns } = intent;
  const index = patterns.indexOf(pattern);
  if (index < 0) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  const newPatterns = patterns.filter((item) => item !== pattern);
  intent.patterns = newPatterns;
  await intentDao.updateIntent(id, intent);
  await intentES.updateIntent(intent);
  return intent;
};

const addUsersayOfIntent = async (id, pattern) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  await intentES.updateIntent(intent);
  return intent;
};

const addParameterOfIntent = async (id, parameter) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  // eslint-disable-next-line array-callback-return
  const intentExist = intent.parameters.find(
    (item) => item.name === parameter.name,
  );
  if (intentExist) {
    throw new CustomError(errorCodes.PARAMETER_EXISTED);
  }

  intent.parameters.push(parameter);
  await intentDao.updateIntent(id, intent);
  return intent;
};

const removeParameterOfIntent = async (id, parameter) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
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

const findParametersByList = async (data) => {
  const parameters = await intentDao.findParametersByList(data);
  return parameters;
};

module.exports = {
  findAllActionByBotId,
  createIntent,
  updateIntent,
  updatePatternOfIntent,
  findIntentByBotId,
  findIntentById,
  deleteIntentById,
  addUsersayOfIntent,
  removeUsersayOfIntent,
  addParameterOfIntent,
  removeParameterOfIntent,
  findParametersByList,
};
