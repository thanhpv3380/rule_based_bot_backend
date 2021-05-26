/* eslint-disable radix */
const { v4: uuidv4 } = require('uuid');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const {
  GROUP_SINGLE,
  GROUP_SINGLE_NAME,
  ROLE_OWNER,
} = require('../constants/index');
const botDao = require('../daos/bot');
const groupActionDao = require('../daos/groupAction');
const groupIntentDao = require('../daos/groupIntent');
const groupEntityDao = require('../daos/groupEntity');
const groupWorkflowDao = require('../daos/groupWorkflow');
const permissionDao = require('../daos/permission');
const actionDao = require('../daos/action');
const intentDao = require('../daos/intent');
const conditionDao = require('../daos/condition');
const dictionaryDao = require('../daos/dictionary');
const dashboardDao = require('../daos/dashboard');
const entityDao = require('../daos/entity');
const nodeDao = require('../daos/node');
const slotDao = require('../daos/slot');
const workflowDao = require('../daos/workflow');

const findAllBot = async ({
  userId,
  key,
  searchFields,
  limit,
  offset,
  fields,
  sort,
}) => {
  const newSearchFields = searchFields ? searchFields.split(',') : null;
  const newFields = fields ? fields.split(',') : null;
  const newSort = sort ? sort.split(',') : null;

  const { data, metadata } = await botDao.findAllBot({
    key,
    searchFields: newSearchFields,
    offset,
    limit,
    fields: newFields,
    sort: newSort,
    populate: ['createBy', 'users'],
  });

  return { bots: data, metadata };
};

const findAllBotByRole = async ({ userId, sort }) => {
  const { data, metadata } = await permissionDao.findAllPermission({
    query: { user: userId },
    sort,
    fields: ['_id', 'bot', 'role'],
    populate: ['bot'],
  });
  const listBot = data.map((el) => el.bot);

  return { bots: listBot, metadata };
};

const findBotById = async (id) => {
  const bot = await botDao.findBot({ _id: id }, null, ['createBy', 'users']);
  if (!bot) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return bot;
};

const createBot = async (userId, data) => {
  data.botToken = uuidv4();
  const bot = await botDao.createBot(data, userId);
  await groupActionDao.createGroupAction({
    name: GROUP_SINGLE_NAME,
    botId: bot.id,
    groupType: GROUP_SINGLE,
  });
  await groupIntentDao.createGroupIntent({
    name: GROUP_SINGLE_NAME,
    botId: bot.id,
    groupType: GROUP_SINGLE,
  });
  await groupEntityDao.createGroupEntity({
    name: GROUP_SINGLE_NAME,
    botId: bot.id,
    groupType: GROUP_SINGLE,
  });
  await groupWorkflowDao.createGroupWorkflow({
    name: GROUP_SINGLE_NAME,
    botId: bot.id,
    groupType: GROUP_SINGLE,
  });
  await permissionDao.createPermission({
    role: ROLE_OWNER,
    bot: bot.id,
    user: userId,
  });
  return bot;
};

const updateBot = async (id, userId, data) => {
  const botExist = await botDao.findBot({
    _id: id,
  });

  if (!botExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  const bot = await botDao.updateBot(id, data);
  return bot;
};

const deleteBot = async (id) => {
  const condition = { bot: id };
  await groupActionDao.deleteByCondition(condition);
  await groupIntentDao.deleteByCondition(condition);
  await groupEntityDao.deleteByCondition(condition);
  await groupWorkflowDao.deleteByCondition(condition);

  await permissionDao.deleteByCondition(condition);
  await actionDao.deleteByCondition(condition);
  await intentDao.deleteByCondition(condition);
  await conditionDao.deleteByCondition(condition);
  await dictionaryDao.deleteByCondition(condition);
  await dashboardDao.deleteByCondition(condition);
  await entityDao.deleteByCondition(condition);
  await nodeDao.deleteByCondition(condition);
  await slotDao.deleteByCondition(condition);
  await workflowDao.deleteByCondition(condition);

  await botDao.deleteBot(id);
};

const addUserInBot = async (botId, userId) => {
  const bot = await botDao.addUserInBot(botId, userId);
  return bot;
};

const removeUserInBot = async (botId, userId) => {
  const bot = await botDao.removeUserInBot(botId, userId);
  return bot;
};

const findBotByToken = async (accessToken) => {
  const bot = await botDao.findBot(
    { botToken: accessToken },
    ['name', '_id'],
    null,
  );
  return bot;
};

const findRoleInBot = async ({ botId, userId }) => {
  const permission = await permissionDao.findPermission(
    { bot: botId, user: userId },
    ['role'],
  );
  return (permission && permission.role) || null;
};

module.exports = {
  findAllBot,
  findAllBotByRole,
  findBotById,
  createBot,
  updateBot,
  deleteBot,
  addUserInBot,
  removeUserInBot,
  findBotByToken,
  findRoleInBot,
};
