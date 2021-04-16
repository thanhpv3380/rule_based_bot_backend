const Slot = require('../models/slot');
const { findAll, findByCondition } = require('../utils/db');

const findAllSlot = async ({
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort,
  populate,
}) => {
  const { data, metadata } = await findAll({
    model: Slot,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return {
    data,
    metadata,
  };
};

const findSlot = async (condition, fields, populate) => {
  const slot = await findByCondition(Slot, condition, fields, populate);
  return slot;
};

const createSlot = async ({ name, dataType, slotType, customData, botId }) => {
  const slot = await Slot.create({
    name,
    dataType,
    slotType,
    customData,
    bot: botId,
  });
  return slot;
};

const updateSlot = async (slotId, data) => {
  const slot = await Slot.findByIdAndUpdate(slotId, data, {
    new: true,
  });
  return slot;
};

const deleteSlot = async (slotId) => {
  await Slot.findByIdAndDelete(slotId);
};

module.exports = {
  findAllSlot,
  findSlot,
  createSlot,
  updateSlot,
  deleteSlot,
};
