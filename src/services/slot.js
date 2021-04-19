/* eslint-disable radix */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const slotDao = require('../daos/slot');

const findAllSlot = async ({ botId, fields, sort }) => {
  const newSort = sort.split(',');
  const newFields = fields.split(',');
  const { data, metadata } = await slotDao.findAllSlot({
    query: { bot: botId },
    fields: newFields,
    sort: newSort,
  });

  return { slots: data, metadata };
};

const findSlotById = async (id) => {
  const slot = await slotDao.findSlot({ _id: id });
  if (slot) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return slot;
};

const createSlot = async ({ name, dataType, slotType, customData, botId }) => {
  const slotExist = await slotDao.findSlot({
    name,
    bot: botId,
  });

  if (slotExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const slot = await slotDao.createSlot({
    name,
    dataType,
    slotType,
    customData,
    botId,
  });
  return slot;
};

const updateSlot = async (id, data, botId) => {
  const { name } = data;
  const slotExist = await slotDao.findSlot({
    _id: { $ne: id },
    name,
    bot: botId,
  });
  if (slotExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const slot = await slotDao.updateSlot(id, data);
  return slot;
};

const deleteSlot = async (id) => {
  await slotDao.deleteSlot(id);
};

module.exports = {
  findAllSlot,
  findSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};
