const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const entityDao = require('../daos/entity');

const findAllEntityByBotId = async ({ botId, keyword }) => {
  const { data } = await entityDao.findAllEntityByCondition({
    key: keyword,
    searchFields: ['name'],
    query: {
      bot: botId,
    },
  });

  return data;
};

const findEntityById = async (id) => {
  const entity = await entityDao.findEntityByCondition({ _id: id });
  if (!entity) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return entity;
};

const createEntity = async ({
  name,
  type,
  pattern,
  synonyms,
  patterns,
  userId,
  groupEntityId,
  botId,
}) => {
  const entityExist = await entityDao.findEntityByCondition({
    name,
    bot: botId,
  });
  if (entityExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const entity = await entityDao.createEntity({
    name,
    type,
    pattern,
    synonyms,
    patterns,
    createBy: userId,
    groupEntityId,
    botId,
  });

  return entity;
};

const updateEntity = async ({
  id,
  name,
  type,
  pattern,
  synonyms,
  patterns,
  groupEntityId,
  botId,
}) => {
  const entityExist = await entityDao.findEntityByCondition({
    _id: { $ne: id },
    name,
    bot: botId,
  });
  if (entityExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const entity = await entityDao.updateEntity(id, {
    name,
    type,
    pattern,
    synonyms,
    patterns,
    groupEntity: groupEntityId,
  });

  return entity;
};

const deleteEntity = async (id) => {
  await entityDao.deleteEntity(id);
};

module.exports = {
  findAllEntityByBotId,
  findEntityById,
  createEntity,
  updateEntity,
  deleteEntity,
};
