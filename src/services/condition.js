const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const conditionDao = require('../daos/condition');

const createCondition = async (data) => {
  const condition = await conditionDao.createCondition(data);
  return condition;
};

const updateCondition = async (id, data) => {
  const condition = await conditionDao.updateCondition(id, data);
  return condition;
};

const findById = async (id, botId) => {
  const condition = await conditionDao.findConditionByCondition({
    condition: {
      bot: botId,
      _id: id,
    },
    populate: [
      {
        path: 'conditions',
        populate: [
          {
            path: 'intent',
            model: 'Intent',
            select: 'name _id',
          },
        ],
      },
      {
        path: 'bot',
        model: 'Bot',
      },
      {
        path: 'createBy',
        model: 'User',
        select: 'name _id',
      },
    ],
  });
  if (!condition) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  return condition;
};

module.exports = {
  createCondition,
  updateCondition,
  findById,
};
