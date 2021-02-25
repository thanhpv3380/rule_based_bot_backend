const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const actionDao = require('../daos/action');
const groupActionDao = require('../daos/groupAction');

const findAllAction = async (id) => {
  const groupActions = groupActionDao.findAllGroupActionAndItem({ botId: id });
  const actions = [];
  actions.push(...groupActions.map((el) => el.actions));

  return { actions, metadata: { total: actions.length } };
};

const findActionById = async (id) => {
  const action = await actionDao.findActionById(id);
  if (!action) {
    throw new CustomError(errorCodes.ACTION_NOT_EXIST);
  }
  return action;
};

const createAction = async ({
  name,
  actions,
  userId,
  groupActionId,
  botId,
}) => {
  const actionExist = await actionDao.findActionByName({ name });
  if (actionExist) {
    throw new CustomError(errorCodes.ACTION_EXIST);
  }
  const action = await actionDao.createAction({ name, actions, userId });
  if (!groupActionId) {
    await groupActionDao.createGroupAction({ botId, isGroup: false });
  } else {
    await groupActionDao.addActionInGroup(groupActionId, action.id);
  }
  return action;
};

const updateAction = async ({ id, name, actions, groupActionId }) => {
  const actionExist = await actionDao.findActionByName({ name });
  if (actionExist.id !== id) {
    throw new CustomError(errorCodes.ACTION_EXIST);
  }
  const action = await actionDao.updateAction({ id, name, actions });

  await groupActionDao.removeActionInGroup(groupActionId, id);

  await groupActionDao.addActionInGroup(groupActionId, id);

  return action;
};

const deleteActionById = async (id) => {
  await actionDao.deleteActionById(id);
};

module.exports = {
  findAllAction,
  findActionById,
  createAction,
  updateAction,
  deleteActionById,
};
