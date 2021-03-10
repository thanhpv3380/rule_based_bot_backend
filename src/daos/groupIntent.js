const GroupIntent = require('../models/groupIntent');
const { findAll, findByCondition } = require('../utils/db');

const findAllGroupIntentAndItem = async ({
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
    model: GroupIntent,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return { data, metadata };
};

const findGroupIntentByCondition = async (condition, fields, populate) => {
  const groupIntent = await findByCondition(
    GroupIntent,
    condition,
    fields,
    populate,
  );
  return groupIntent;
};

const createGroupIntent = async ({ name, botId, groupType }) => {
  const groupIntent = await GroupIntent.create({
    name,
    bot: botId,
    groupType,
  });
  return groupIntent;
};

const updateGroupIntent = async (id, data) => {
  const groupIntent = await GroupIntent.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await GroupIntent.findByIdAndDelete(id);
};

module.exports = {
  findAllGroupIntentAndItem,
  findGroupIntentByCondition,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
