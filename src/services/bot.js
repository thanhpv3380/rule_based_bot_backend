/* eslint-disable guard-for-in */
/* eslint-disable radix */
const { v4: uuidv4 } = require('uuid');
const admz = require('adm-zip');
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
const actionDao = require('../daos/action');
const intentDao = require('../daos/intent');
const conditionDao = require('../daos/condition');
const dictionaryDao = require('../daos/dictionary');
const dashboardDao = require('../daos/dashboard');
const entityDao = require('../daos/entity');
const nodeDao = require('../daos/node');
const slotDao = require('../daos/slot');
const workflowDao = require('../daos/workflow');

// eslint-disable-next-line new-cap
const zp = new admz();

const findAllBotByRole = async ({ userId, sort }) => {
  const newSort = sort && sort.split(',');
  const { data, metadata } = await botDao.findAllBot({
    sort: newSort,
    query: {
      'permissions.user': userId,
    },
    populate: ['createBy', 'permissions.user'],
  });

  return { bots: data, metadata };
};

const findBotById = async ({ botId, userId }) => {
  const bot = await botDao.findBot(
    { _id: botId, 'permissions.user': userId },
    null,
    ['createBy', 'permissions.user'],
  );
  if (!bot) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return bot;
};

const addPermission = async (id, data) => {
  const botExist = await botDao.findBot({
    _id: id,
  });

  if (!botExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  const bot = await botDao.addPermission(id, data);
  return bot;
};

const deletePermission = async (id, userId) => {
  const botExist = await botDao.findBot({
    _id: id,
  });

  if (!botExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  const bot = await botDao.deletePermission(id, userId);
  return bot;
};

const createBot = async (userId, data) => {
  data.botToken = uuidv4();
  data.permissions = [
    {
      user: userId,
      role: ROLE_OWNER,
    },
  ];
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

const findBotByToken = async (accessToken) => {
  const bot = await botDao.findBot(
    { botToken: accessToken },
    ['name', '_id'],
    null,
  );
  return bot;
};

const findRoleInBot = async ({ botId, userId }) => {
  const bot = await botDao.findBot({ _id: botId }, ['permissions']);
  if (!bot) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  const permission =
    bot.permissions &&
    bot.permissions.find((el) => {
      return el.user.equals(userId);
    });
  return (permission && permission.role) || null;
};

const getFileExportOfBot = async (botId) => {
  const bot = await botDao.findBot({ _id: botId });
  zp.addFile(
    'bot.json',
    Buffer.from(JSON.stringify(bot), 'utf8'),
    'entry comment goes here',
  );
  const { data: intents } = await intentDao.findAllIntentByCondition({
    bot: botId,
  });
  for (const el in intents) {
    zp.addFile(
      `intents/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: entities } = await entityDao.findAllEntityByCondition({
    bot: botId,
  });
  for (const el in entities) {
    zp.addFile(
      `entities/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: actions } = await actionDao.findAllActionByCondition({
    bot: botId,
  });
  for (const el in actions) {
    zp.addFile(
      `actions/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: conditions } = await actionDao.findAllActionByCondition({
    bot: botId,
  });
  for (const el in conditions) {
    zp.addFile(
      `conditions/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: workflows } = await workflowDao.findAllWorkflowByCondition({
    bot: botId,
  });
  for (const el in workflows) {
    zp.addFile(
      `workflows/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: nodes } = await nodeDao.findAllNodeByCondition({ bot: botId });
  zp.addFile(
    `nodes/nodes.json`,
    Buffer.from(JSON.stringify(nodes), 'utf8'),
    'entry comment goes here',
  );

  const groupActions = await groupActionDao.findAllGroupActionByCondition({
    bot: botId,
  });
  zp.addFile(
    `actions/groupActions.json`,
    Buffer.from(JSON.stringify(groupActions), 'utf8'),
    'entry comment goes here',
  );
  const groupIntents = await groupIntentDao.findAllGroupIntentByCondition({
    bot: botId,
  });
  zp.addFile(
    `intents/groupIntents.json`,
    Buffer.from(JSON.stringify(groupIntents), 'utf8'),
    'entry comment goes here',
  );
  const groupEntities = await groupEntityDao.findAllGroupEntityByCondition({
    bot: botId,
  });
  zp.addFile(
    `entities/groupEntities.json`,
    Buffer.from(JSON.stringify(groupEntities), 'utf8'),
    'entry comment goes here',
  );
  const groupWorkFlows = await groupWorkflowDao.findGroupWorkflowByCondition({
    bot: botId,
  });
  zp.addFile(
    `workflows/groupWorkFlows.json`,
    Buffer.from(JSON.stringify(groupWorkFlows), 'utf8'),
    'entry comment goes here',
  );

  const data = zp.toBuffer();
  return {
    data,
    name: bot.name,
  };
};

const importFile = async (botId, file) => {
  zp.readFile(file);
  return 'test';
};

module.exports = {
  findAllBotByRole,
  findBotById,
  createBot,
  updateBot,
  deleteBot,
  findBotByToken,
  findRoleInBot,
  addPermission,
  deletePermission,
  getFileExportOfBot,
  importFile,
};
