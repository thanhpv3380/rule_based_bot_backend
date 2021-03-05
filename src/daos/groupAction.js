const GroupAction = require('../models/groupAction');
const { findAll, findByCondition } = require('../utils/db');

const findAllGroupActionAndItem = async ({
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
    model: GroupAction,
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

const findGroupActionByCondition = async (condition, fields, populate) => {
  const groupAction = await findByCondition(
    GroupAction,
    condition,
    fields,
    populate,
  );
  return groupAction;
};

const createGroupAction = async ({ name, botId, groupType }) => {
  const groupAction = await GroupAction.create({
    name,
    bot: botId,
    groupType,
  });
  return groupAction;
};

const updateGroupAction = async (id, data) => {
  const groupAction = await GroupAction.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupAction;
};

const deleteGroupAction = async (id) => {
  await GroupAction.findByIdAndDelete(id);
};

module.exports = {
  findAllGroupActionAndItem,
  findGroupActionByCondition,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
