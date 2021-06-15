/* eslint-disable guard-for-in */
/* eslint-disable radix */
const {
  Types: { ObjectId },
} = require('mongoose');
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
const intentES = require('../elasticsearch/intent');

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
  for (const el of intents) {
    zp.addFile(
      `intents/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: entities } = await entityDao.findAllEntityByCondition({
    bot: botId,
  });
  for (const el of entities) {
    zp.addFile(
      `entities/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: actions } = await actionDao.findAllActionByCondition({
    bot: botId,
  });
  for (const el of actions) {
    zp.addFile(
      `actions/${el.name}.json`,
      Buffer.from(JSON.stringify(el), 'utf8'),
      'entry comment goes here',
    );
  }
  const { data: conditions } = await conditionDao.findAllConditionByCondition({
    bot: botId,
  });
  zp.addFile(
    `conditions/conditions.json`,
    Buffer.from(JSON.stringify(conditions), 'utf8'),
    'entry comment goes here',
  );
  const { data: workflows } = await workflowDao.findAllWorkflowByCondition({
    bot: botId,
  });
  for (const el of workflows) {
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

  const {
    data: groupActions,
  } = await groupActionDao.findAllGroupActionByCondition({
    bot: botId,
  });
  zp.addFile(
    `actions/groupActions.json`,
    Buffer.from(JSON.stringify(groupActions), 'utf8'),
    'entry comment goes here',
  );
  const {
    data: groupIntents,
  } = await groupIntentDao.findAllGroupIntentByCondition({
    bot: botId,
  });
  zp.addFile(
    `intents/groupIntents.json`,
    Buffer.from(JSON.stringify(groupIntents), 'utf8'),
    'entry comment goes here',
  );
  const {
    data: groupEntities,
  } = await groupEntityDao.findAllGroupEntityByCondition({
    bot: botId,
  });
  zp.addFile(
    `entities/groupEntities.json`,
    Buffer.from(JSON.stringify(groupEntities), 'utf8'),
    'entry comment goes here',
  );
  const {
    data: groupWorkFlows,
  } = await groupWorkflowDao.findAllGroupWorkflowByCondition({
    bot: botId,
  });
  zp.addFile(
    `workflows/groupWorkflows.json`,
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
  if (!file) {
    throw new CustomError(errorCodes.ITEM_NOT_EXIST);
  }
  const {
    bot,
    intents,
    actions,
    entities,
    conditions,
    workflows,
    groupWorkflows,
    groupIntents,
    nodes,
    groupEntities,
    groupActions,
  } = getDataFromFileImport(file.file.data);
  bot._id = botId;
  for (const elGroup of groupIntents) {
    const idGroup = new ObjectId();
    for (const el of intents) {
      if (el.groupIntent === elGroup._id || !el.groupIntent) {
        el.groupIntent = idGroup;
      }
    }
    elGroup.bot = ObjectId(botId);
    elGroup._id = idGroup;
  }

  for (const elIntent of intents) {
    const intentId = new ObjectId();
    for (const elCondition of conditions) {
      if (elCondition.conditions) {
        for (const e of elCondition.conditions) {
          if (e.intent === elIntent._id) {
            e.intent = intentId;
          }
        }
      }
    }
    for (const elNode of nodes) {
      if (elNode.intent === elIntent._id) {
        elNode.intent = intentId;
      }
    }
    elIntent.bot = ObjectId(botId);
    elIntent._id = intentId;
  }

  for (const elGroup of groupActions) {
    const idGroup = new ObjectId();
    for (const el of actions) {
      if (el.groupAction === elGroup._id || !el.groupAction) {
        el.groupAction = idGroup;
      }
    }
    elGroup.bot = ObjectId(botId);
    elGroup._id = idGroup;
  }

  for (const elAction of actions) {
    const actionId = new ObjectId();
    for (const elNode of nodes) {
      if (elNode.action === elAction._id) {
        elNode.action = actionId;
      }
      if (
        elNode.actionAskAgain &&
        elNode.actionAskAgain.actionAskAgain === elAction._id
      ) {
        elNode.actionAskAgain.actionAskAgain = actionId;
      }
      if (
        elNode.actionFail &&
        elNode.actionAskAgain.actionFail === elAction._id
      ) {
        elNode.actionAskAgain.actionFail = actionId;
      }
    }
    for (const elIntent of intents) {
      if (elIntent.mappingAction && elIntent.mappingAction === elAction._id) {
        elIntent.mappingAction = actionId;
      }
      if (elIntent.parameters) {
        for (const parameter of elIntent.parameters) {
          // Todo có thể lỗi
          if (
            parameter.response &&
            parameter.response.actionAskAgain === elAction._id
          ) {
            parameter.response.actionAskAgain = actionId;
          }
          if (
            parameter.response &&
            parameter.response.actionBreak === elAction._id
          ) {
            parameter.response.actionBreak = actionId;
          }
        }
      }
    }
    elAction.bot = ObjectId(botId);
    elAction._id = actionId;
  }

  for (const elGroup of groupEntities) {
    const idGroup = new ObjectId();
    for (const el of entities) {
      if (el.groupEntity === elGroup._id || !el.groupEntity) {
        el.groupEntity = idGroup;
      }
    }
    elGroup.bot = botId;
    elGroup._id = idGroup;
  }

  for (const elEntity of entities) {
    const entityId = new ObjectId();
    for (const elIntent of intents) {
      if (elIntent.parameters) {
        for (const parameter of elIntent.parameters) {
          if (parameter.entity === elEntity._id) {
            parameter.entity = entityId;
          }
        }
      }
    }
    elEntity.bot = ObjectId(botId);
    elEntity._id = entityId;
  }

  for (const elCondition of conditions) {
    const conditionId = new ObjectId();
    for (const elNode of nodes) {
      if (elNode.condition === elCondition._id) {
        elNode.condition = conditionId;
      }
    }
    elCondition.bot = ObjectId(botId);
    elCondition._id = conditionId;
  }

  for (const node of nodes) {
    const nodeId = new ObjectId();
    for (const mapNode of nodes) {
      if (mapNode.children) {
        for (const nodeChildren of mapNode.children) {
          if (nodeChildren.node === node._id) {
            nodeChildren.node = nodeId;
          }
        }
      }
      if (mapNode.parent) {
        for (const nodeParent of mapNode.parent) {
          if (nodeParent.node === node._id) {
            nodeParent.node = nodeId;
          }
        }
      }
    }
    node.bot = ObjectId(botId);
    node._id = nodeId;
  }

  for (const elGroup of groupWorkflows) {
    const idGroup = new ObjectId();
    for (const el of workflows) {
      if (el.groupWorkflow === elGroup._id || !el.groupWorkflow) {
        el.groupWorkflow = idGroup;
      }
    }
    elGroup.bot = ObjectId(botId);
    elGroup._id = idGroup;
  }

  for (const elWorkflow of workflows) {
    const workflowId = new ObjectId();
    for (const elNode of nodes) {
      if (elNode.workflow === elWorkflow._id) {
        elNode.workflow = workflowId;
      }
    }
    elWorkflow.bot = ObjectId(botId);
    elWorkflow._id = workflowId;
  }
  await deleteOldData(botId);
  await saveData({
    bot,
    intents,
    actions,
    entities,
    conditions,
    workflows,
    groupWorkflows,
    groupIntents,
    nodes,
    groupEntities,
    groupActions,
  });
};

const deleteOldData = async (botId) => {
  const condition = { bot: botId };
  await groupActionDao.deleteByCondition(condition);
  await groupIntentDao.deleteByCondition(condition);
  await groupEntityDao.deleteByCondition(condition);
  await groupWorkflowDao.deleteByCondition(condition);
  await actionDao.deleteByCondition(condition);
  await intentDao.deleteByCondition(condition);
  await intentES.deleteIntentByCondition(condition);
  await conditionDao.deleteByCondition(condition);
  await dictionaryDao.deleteByCondition(condition);
  await dashboardDao.deleteByCondition(condition);
  await entityDao.deleteByCondition(condition);
  await nodeDao.deleteByCondition(condition);
  await slotDao.deleteByCondition(condition);
  await workflowDao.deleteByCondition(condition);
};

const saveData = async ({
  intents,
  actions,
  entities,
  conditions,
  workflows,
  groupWorkflows,
  groupIntents,
  nodes,
  groupEntities,
  groupActions,
}) => {
  for (const el of groupIntents) {
    await groupIntentDao.createGroupIntent({
      _id: el._id,
      name: el.name,
      botId: el.bot,
      groupType: el.groupType,
    });
  }
  for (const el of groupActions) {
    await groupActionDao.createGroupAction({
      _id: el._id,
      name: el.name,
      botId: el.bot,
      groupType: el.groupType,
    });
  }
  for (const el of groupEntities) {
    await groupEntityDao.createGroupEntity({
      _id: el._id,
      name: el.name,
      botId: el.bot,
      groupType: el.groupType,
    });
  }
  for (const el of groupWorkflows) {
    await groupWorkflowDao.createGroupWorkflow({
      _id: el._id,
      name: el.name,
      botId: el.bot,
      groupType: el.groupType,
    });
  }
  for (const el of intents) {
    const intent = await intentDao.createIntent({
      _id: el._id,
      bot: el.bot,
      groupIntent: el.groupIntent,
      isMappingAction: el.isMappingAction,
      mappingAction: el.mappingAction,
      name: el.name,
      parameters: el.parameters,
      patterns: el.patterns,
    });
    await intentES.createIntent(intent);
  }
  for (const el of actions) {
    await actionDao.createAction({
      _id: el._id,
      actions: el.actions,
      botId: el.bot,
      groupActionId: el.groupAction,
      name: el.name,
    });
  }
  for (const el of entities) {
    await entityDao.createEntity({
      _id: el._id,
      botId: el.bot,
      groupEntityId: el.groupEntity,
      name: el.name,
      pattern: el.pattern,
      patterns: el.patterns,
      synonyms: el.synonyms,
      type: el.type,
    });
  }
  for (const el of conditions) {
    await conditionDao.createCondition({
      _id: el._id,
      operator: el.operator,
      conditions: el.conditions,
      bot: el.bot,
      createBy: el.createBy,
    });
  }
  for (const el of nodes) {
    await nodeDao.createNode({
      _id: el._id,
      bot: el.bot,
      children: el.children,
      parent: el.parent,
      position: el.position,
      type: el.type,
      workflow: el.workflow,
      intent: el.intent,
      condition: el.condition,
      action: el.action,
      actionAskAgain: el.actionAskAgain,
    });
  }
  for (const el of workflows) {
    await workflowDao.createWorkflow({
      _id: el._id,
      bot: el.bot,
      groupWorkflow: el.groupWorkflow,
      name: el.name,
      offsetX: el.offsetX,
      offsetY: el.offsetY,
      zoom: el.zoom,
      createBy: el.createBy,
    });
  }
};

const getDataFromFileImport = (data) => {
  // eslint-disable-next-line new-cap
  const zip = new admz(data);
  const intents = [];
  const actions = [];
  const entities = [];
  const workflows = [];
  let conditions = [];
  let groupWorkflows = [];
  let groupIntents = [];
  let nodes = [];
  let groupEntities = [];
  let groupActions = [];
  let bot = {};
  zip.getEntries().forEach((el) => {
    const name = el.entryName;
    if (name.includes('undefined.json')) {
      // continue loop
    } else if (name === 'intents/groupIntents.json') {
      groupIntents = JSON.parse(el.getData());
    } else if (name.includes('intents/')) {
      intents.push(JSON.parse(el.getData()));
    } else if (name === 'actions/groupActions.json') {
      groupActions = JSON.parse(el.getData());
    } else if (name === 'entities/groupEntities.json') {
      groupEntities = JSON.parse(el.getData());
    } else if (name === 'workflows/groupWorkflows.json') {
      groupWorkflows = JSON.parse(el.getData());
    } else if (name.includes('actions/')) {
      actions.push(JSON.parse(el.getData()));
    } else if (name.includes('entities/')) {
      entities.push(JSON.parse(el.getData()));
    } else if (name.includes('conditions/')) {
      conditions = JSON.parse(el.getData());
    } else if (name.includes('workflows/')) {
      workflows.push(JSON.parse(el.getData()));
    } else if (name.includes('nodes/')) {
      nodes = JSON.parse(el.getData());
    } else if (name.includes('bot.json')) {
      bot = JSON.parse(el.getData());
    }
  });
  return {
    bot,
    intents,
    actions,
    entities,
    conditions,
    workflows,
    groupWorkflows,
    groupIntents,
    nodes,
    groupEntities,
    groupActions,
  };
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
