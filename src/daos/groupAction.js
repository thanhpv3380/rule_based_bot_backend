const GroupAction = require('../models/groupAction');

const findAllGroupAction = async (id) => {
  const groupActions = await GroupAction.find({ bot: id });
  return groupActions;
};

const findAllGroupActionAndItem = async ({ keyword, botId }) => {
  const groupActions = await GroupAction.find({ bot: botId }).populate([
    'Action',
  ]);
  return groupActions;
};

const findGroupActionById = async ({ id, fields }) => {
  const groupAction = await GroupAction.findById({ id });
  return groupAction;
};

const findGroupActionByName = async ({ name }) => {
  const groupAction = await GroupAction.findOne({ name });
  return groupAction;
};

const createGroupAction = async ({ name, botId, isGroup }) => {
  const groupAction = await GroupAction.create({
    name,
    bot: botId,
    isGroup,
  });
  return groupAction;
};

const updateGroupAction = async ({ id, name }) => {
  const groupAction = await GroupAction.updateOne({ _id: id }, { name });
  return groupAction;
};

const deleteGroupAction = async (id) => {
  await GroupAction.deleteOne({ _id: id });
};

const addActionInGroup = async (groupActionId, actionId) => {
  const groupAction = await GroupAction.updateOne(
    { _id: groupActionId },
    { $push: { actions: actionId } },
  );
  return groupAction;
};

const removeActionInGroup = async (groupActionId, actionId) => {
  const groupAction = await GroupAction.updateOne(
    {},
    { $pull: { actions: actionId } },
  );
  return groupAction;
};

module.exports = {
  findAllGroupAction,
  findAllGroupActionAndItem,
  findGroupActionById,
  findGroupActionByName,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
  addActionInGroup,
  removeActionInGroup,
};
