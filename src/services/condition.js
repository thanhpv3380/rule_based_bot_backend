const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const conditionDao = require('../daos/condition');
const intentDao = require('../daos/intent');
const slotDao = require('../daos/slot');

const createCondition = async (data) => {
  const condition = await conditionDao.createCondition(data);
  return condition;
};

const updateCondition = async (id, data) => {
  const condition = await conditionDao.updateCondition(id, data);
  return condition;
};

const findById = async (id) => {
  const condition = await conditionDao.findById(id);
  if (!condition) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  const conditionsResponse = [];
  for (const el of condition.conditions) {
    let parameter = null;
    if (el.intent) {
      parameter = await intentDao.findParameterById(el.intent, el.parameter);
    } else {
      parameter = await slotDao.findSlot({ _id: el.parameter });
    }
    console.log({ parameter });
    const data = {
      ...el,
      parameter,
    };
    conditionsResponse.push(data);
  }
  condition.conditions = conditionsResponse;
  return condition;
};

// const findByIdT = async (id) => {
//   const condition = await conditionDao.findConditionByCondition({
//     condition: {
//       _id: id,
//     },
//     populate: [
//       {
//         path: 'conditions',
//         populate: [
//           {
//             path: 'intent',
//             model: 'Intent',
//             select: 'name _id',
//           },
//         ],
//       },
//       {
//         path: 'bot',
//         model: 'Bot',
//       },
//       {
//         path: 'createBy',
//         model: 'User',
//         select: 'name _id',
//       },
//     ],
//   });
//   console.log(condition, 'condition');
//   if (!condition) {
//     throw new CustomError(errorCodes.ITEM_NOT_EXIST);
//   }
//   return condition;
// };

module.exports = {
  createCondition,
  updateCondition,
  findById,
};
