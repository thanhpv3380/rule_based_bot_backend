/* eslint-disable guard-for-in */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const {GROUP} = require('../constants/index');
const groupEntityDao = require('../daos/groupEntity');

const findAllGroupEntityAndItem = async ({keyword, botId}) => {
  const groupEntities = await groupEntityDao.findAllGroupEntityAndItem({
    keyword,
    botId,
  });
  return groupEntities;
};

const findGroupEntityById = async (id) => {
  const groupEntity = await groupEntityDao.findGroupEntityByCondition({
    _id: id,
  });
  if (!groupEntity) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return groupEntity;
};

const createGroupEntity = async ({name, botId}) => {
  const groupEntityExist = await groupEntityDao.findGroupEntityByCondition({
    name,
    bot: botId,
  });
  if (groupEntityExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const groupEntity = await groupEntityDao.createGroupEntity({
    name,
    botId,
    groupType: GROUP,
  });
  return groupEntity;
};

const updateGroupEntity = async ({id, botId, name}) => {
  let groupEntityExist = await groupEntityDao.findGroupEntityByCondition({
    _id: id,
  });
  if (!groupEntityExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  groupEntityExist = await groupEntityDao.findGroupEntityByCondition({
    _id: {$ne: id},
    name,
    bot: botId,
  });
  if (groupEntityExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const groupEntity = await groupEntityDao.updateGroupEntity(id, {name});
  return groupEntity;
};

const deleteGroupEntity = async (id) => {
  await groupEntityDao.deleteGroupEntity(id);
};

module.exports = {
  findAllGroupEntityAndItem,
  findGroupEntityById,
  createGroupEntity,
  updateGroupEntity,
  deleteGroupEntity,
};
