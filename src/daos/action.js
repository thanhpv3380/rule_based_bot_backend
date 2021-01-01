const Action = require('../models/action');

const findActionById = async (id) => {
  const action = await Action.findById({ _id: id });
  return action;
};

const findActionByName = async ({ name }) => {
  const action = await Action.findOne({ name });
  return action;
};

const createAction = async ({ name, actions, userId }) => {
  const action = await Action.create({
    name,
    actions,
    createBy: userId,
  });
  return action;
};

const updateAction = async ({ id, name, actions }) => {
  const action = await Action.updateOne(
    { _id: id },
    {
      name,
      actions,
    },
  );
  return action;
};

const deleteAction = async (id) => {
  await Action.deleteOne({ _id: id });
};

module.exports = {
  findActionById,
  findActionByName,
  createAction,
  updateAction,
  deleteAction,
};
