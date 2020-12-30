const Action = require('../models/action');

const findAllAction = async () => {
  const actions = await Action.find();
  return actions;
};

const findActionById = async ({ id }) => {
  const action = await Action.findById({ id });
  return action;
};

const createAction = async ({}) => {};

const updateAction = async ({}) => {};

const deleteAction = async ({ id }) => {
  await Action.deleteOne({ _id: id });
};

module.exports = {
  findAllAction,
  findActionById,
  createAction,
  updateAction,
  deleteAction,
};
