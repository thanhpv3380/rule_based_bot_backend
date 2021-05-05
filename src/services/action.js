const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const actionDao = require('../daos/action');

const findAllActionByBotId = async ({ botId, fields, sort }) => {
  const newFields = fields.split(',');
  const newSort = sort.split(',');
  const { data } = await actionDao.findAllActionByCondition({
    fields: newFields,
    sort: newSort,
    query: {
      bot: botId,
    },
  });

  return data;
};

const findActionById = async (id) => {
  const action = await actionDao.findActionByCondition({ _id: id });
  if (!action) {
    throw new CustomError(errorCodes.NOT_FOUND);
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
  const actionExist = await actionDao.findActionByCondition({
    name,
    bot: botId,
  });
  if (actionExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const action = await actionDao.createAction({
    name,
    actions,
    userId,
    groupActionId,
    botId,
  });

  return action;
};

const updateAction = async ({ id, name, actions, groupActionId, botId }) => {
  const actionExist = await actionDao.findActionByCondition({
    _id: { $ne: id },
    name,
    bot: botId,
  });
  if (actionExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }

  const action = await actionDao.updateAction(id, {
    name,
    actions,
    groupAction: groupActionId,
  });

  return action;
};

const deleteAction = async (id) => {
  await actionDao.deleteAction(id);
};

module.exports = {
  findAllActionByBotId,
  findActionById,
  createAction,
  updateAction,
  deleteAction,
};
