const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const intentDao = require('../daos/intent');
const intentES = require('../elasticsearch/intent');
const actionDao = require('../daos/action');

const createIntent = async (data) => {
  const intentExist = await intentDao.findIntentByCondition({
    condition: {
      name: data.name,
    },
  });
  if (intentExist) {
    throw new CustomError(errorCodes.ITEM_NAME_EXIST);
  }
  const intent = await intentDao.createIntent(data);
  intent.patterns.array.forEach(async (element) => {
    await intentES.createUsersay(intent._id, element, intent.mappingAction);
  });
  return intent;
};

const updateIntent = async (id, data) => {
  const intentNameExist = await intentDao.findIntentByCondition({
    condition: {
      name: data.name,
    },
  });
  if (intentNameExist && intentNameExist._id.toString() !== id) {
    throw new CustomError(errorCodes.INTENT_NAME_EXIST);
  }
  const intent = await intentDao.updateIntent(id, data);
  intentES.updateMutiUsersay(intent);
  return intent;
};

const updatePatternOfIntent = async ({ id, pattern }) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  if (intent.patterns.includes(pattern)) {
    throw new CustomError(errorCodes.PATTERN_EXIST);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  const newPattern = intent.patterns.find(
    (el) => el.usersay === pattern.usersay,
  );
  intentES.updateUsersay(intent._id, newPattern, intent.mappingAction);
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
        path: 'patterns',
        populate: {
          path: 'parameters',
          populate: {
            path: 'entity',
            model: 'Entity',
            select: 'name _id',
          },
        },
      },
    ],
  });
  if (!intent) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  return intent;
};

const deleteIntentById = async (id) => {
  await intentDao.deleteIntent(id);
  intentES.deleteUsersays(id);
};

const removeUsersayOfIntent = async (id, pattern) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.INTENT_NOT_EXIST);
  }
  const { patterns } = intent;
  const index = patterns.indexOf(pattern);
  if (index < 1) {
    throw new CustomError(errorCodes.PATTERN_NOT_FOUND);
  }
  const newPatterns = patterns.filter((item) => item._id !== pattern.id);
  intent.patterns = newPatterns;
  await intentDao.updateIntent(id, intent);
  intentES.deleteUsersay(pattern.id);
  return intent;
};

const addUsersayOfIntent = async (id, pattern) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
  });
  if (!intent) {
    throw new CustomError(errorCodes.ITEM_NOT_CHANGE);
  }
  const pos = intent.patterns.findIndex((el) => el.usersay === pattern.usersay);
  if (pos >= 0) {
    throw new CustomError(errorCodes.USERSAY_EXISTED);
  }
  intent.patterns.push(pattern);
  await intentDao.updateIntent(id, intent);
  const newPattern = intent.patterns.find(
    (el) => el.usersay === pattern.usersay,
  );
  intentES.createUsersay(intent.id, newPattern, intent.mappingAction);
  return newPattern;
};

// const addParameterOfIntent = async (id, parameter) => {
//   const intent = await intentDao.findIntentByCondition({
//     condition: { _id: id },
//   });
//   if (!intent) {
//     throw new CustomError(errorCodes.INTENT_NOT_EXIST);
//   }
//   // eslint-disable-next-line array-callback-return
//   const intentExist = intent.parameters.find(
//     (item) => item.name === parameter.name,
//   );
//   if (intentExist) {
//     throw new CustomError(errorCodes.PARAMETER_EXISTED);
//   }

//   intent.parameters.push(parameter);
//   await intentDao.updateIntent(id, intent);
//   intentES.addOrUpdateIntent(intent);
//   return intent;
// };

// const removeParameterOfIntent = async (id, parameter) => {
//   const intent = await intentDao.findIntentByCondition({
//     condition: { _id: id },
//   });
//   if (!intent) {
//     throw new CustomError(errorCodes.INTENT_NOT_EXIST);
//   }
//   const { length } = intent.parameters;
//   intent.parameters = intent.parameters.filter(
//     (item) => item.name !== parameter.name,
//   );
//   if (length === intent.parameters.length) {
//     throw new CustomError(errorCodes.PARAMETER_NOT_EXIST);
//   }
//   await intentDao.updateIntent(id, intent);
//   intentES.addOrUpdateIntent(intent);
//   return intent;
// };

const findUsersay = async (usersay) => {
  const { hits } = await intentES.findUsersay(usersay);
  // console.log(hits);
  const intent = hits.hits.find((el) => el._score === hits.max_score)._source;
  const action = await actionDao.findActionByCondition({
    condition: { _id: intent.action },
  });
  // if (intent.parameter.length !== 0) {
  //   const parameter = intent.parameter.map((el) => {
  //     const posParameterPattern = intent.usersay.indexOf(el.value);
  //     if (intent.usersay.indexOf(usersay.slice(0, posParameterPattern)) >= 0) {
  //       // sai intent
  //     } else {
  //       // iii
  //     }
  //   });
  // }
  const response = action.actions.map((item) => {
    if (item.typeAction === 'TEXT') {
      return item.text;
    }
    return item;
  });
  return response;
};

module.exports = {
  createIntent,
  updateIntent,
  updatePatternOfIntent,
  findIntentById,
  deleteIntentById,
  addUsersayOfIntent,
  removeUsersayOfIntent,
  // addParameterOfIntent,
  // removeParameterOfIntent,
  findUsersay,
};
