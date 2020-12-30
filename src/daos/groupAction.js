const GroupAction = require('../models/groupAction');

const findAllGroupAction = async () => {
  const groupActions = await GroupAction.find();
  return groupActions;
};

const findGroupActionById = async ({ id }) => {
  const groupAction = await GroupAction.findById({ id });
  return groupAction;
};

const findGroupActionByName = async ({ name }) => {
  const groupAction = await GroupAction.findOne({ name });
  return groupAction;
};

const createGroupAction = async ({ name }) => {
  const groupAction = await GroupAction.create({ name });
  return groupAction;
};

const updateGroupAction = async ({ id, name }) => {
  const groupAction = await GroupAction.updateOne({ _id: id }, { name });
  return groupAction;
};

const deleteGroupAction = async ({ id }) => {
  await GroupAction.deleteOne({ _id: id });
};

module.exports = {
  findAllGroupAction,
  findGroupActionById,
  findGroupActionByName,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
