const Action = require('../models/action');
const { findAll, findByCondition } = require('../utils/db');

const findAllActionByCondition = async ({
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
    model: Action,
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

const findActionByCondition = async (condition, fields, populate) => {
  const action = await findByCondition(Action, condition, fields, populate);
  return action;
};

const createAction = async ({
  name,
  actions,
  userId,
  groupActionId,
  botId,
}) => {
  const action = await Action.create({
    name,
    actions,
    createBy: userId,
    groupAction: groupActionId,
    bot: botId,
  });
  return action;
};

const updateAction = async (id, data) => {
  const action = await Action.findByIdAndUpdate(id, data, { new: true });
  return action;
};

const deleteAction = async (id) => {
  await Action.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await Action.remove(condition);
};

module.exports = {
  findAllActionByCondition,
  findActionByCondition,
  createAction,
  updateAction,
  deleteAction,
  deleteByCondition,
};
