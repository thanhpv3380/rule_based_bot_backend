const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const workflowDao = require('../daos/workflow');
const nodeDao = require('../daos/node');
const {
  Types: { ObjectId },
} = require('mongoose');

const findAllWorkflowByBotId = async ({ botId, keyword }) => {
  const { data } = await workflowDao.findAllWorkflowByCondition({
    key: keyword,
    searchFields: ['name'],
    query: {
      bot: botId,
    },
  });

  return data;
};

const findWorkflowById = async (id) => {
  const workflow = await workflowDao.findWorkflowAndItem(id);
  return workflow;
};

const createWorkflow = async ({
  name,
  nodes,
  userId,
  groupWorkflowId,
  botId,
}) => {
  const workflowExist = await workflowDao.findWorkflowByCondition({
    name,
    bot: botId,
  });
  if (workflowExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const workflow = await workflowDao.createWorkflow({
    name,
    nodes,
    userId,
    groupWorkflowId,
    botId,
  });

  return workflow;
};

const updateWorkflow = async (id, data, botId) => {
  const params = data;

  for (const prop in params) {
    if (Array.isArray(params[prop])) {
      if (params[prop].length <= 0) delete params[prop];
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!params[prop]) delete params[prop];
    }
  }

  if (params && params.name) {
    const workflowExist = await workflowDao.findWorkflowByCondition({
      _id: { $ne: id },
      name: data.name,
      bot: botId,
    });
    if (workflowExist) {
      throw new CustomError(errorCodes.ITEM_NAME_EXIST);
    }
  }
  // if (params && params.nodes) {
  //   params.nodes.map(async (el) => {
  //     el.workflow = id;
  //     el._id = ObjectId(el.id);
  //     await nodeDao.create(el);
  //   });
  // }

  if (params && params.nodes) {
    // const newNodes = params.nodes.map((el) => {
    //   const obj = {
    //     ...el,
    //     _id: ObjectId(el.id),
    //   };
    //   delete obj.id;
    //   return obj;
    // });
    params.nodes.map(async (el) => {
      await nodeDao.updateNode(el.id, el);
    });

    delete params.nodes;
  }
  const workflow = await workflowDao.updateWorkflow(id, params);
  return workflow;
};

const deleteWorkflow = async (id) => {
  await workflowDao.deleteWorkflow(id);
};

module.exports = {
  findAllWorkflowByBotId,
  findWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
