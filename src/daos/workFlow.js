const {
  Types: { ObjectId },
} = require('mongoose');
const Workflow = require('../models/workflow');
const { findAll, findByCondition } = require('../utils/db');

const findAllWorkflowByCondition = async ({
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort,
  populate,
}) => {
  const { data, metadata } = await findAll({
    model: Workflow,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return { data, metadata };
};

const findWorkflowAndItem = async (id) => {
  const workflow = await Workflow.aggregate([
    {
      $match: { _id: ObjectId(id) },
    },
    {
      $lookup: {
        from: 'nodes',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$workflow', '$$id'],
              },
            },
          },
          {
            $lookup: {
              from: 'intents',
              let: { intent: '$intent' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$intent'],
                    },
                  },
                },
              ],
              as: 'intent',
            },
          },
          {
            $lookup: {
              from: 'conditions',
              let: { condition: '$condition' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$condition'],
                    },
                  },
                },
              ],
              as: 'condition',
            },
          },
          {
            $lookup: {
              from: 'actions',
              let: { action: '$action' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$_id', '$$action'],
                    },
                  },
                },
              ],
              as: 'action',
            },
          },
        ],
        as: 'nodes',
      },
    },
  ]);
  return workflow;
};

const findWorkflowByCondition = async (condition, fields, populate) => {
  const workflow = await findByCondition(Workflow, condition, fields, populate);
  return workflow;
};

const createWorkflow = async ({
  name,
  Workflows,
  userId,
  groupWorkflowId,
  botId,
}) => {
  const workflow = await Workflow.create({
    name,
    Workflows,
    createBy: userId,
    groupWorkflow: groupWorkflowId,
    bot: botId,
  });
  return workflow;
};

const updateWorkflow = async (id, data) => {
  const workflow = await Workflow.findByIdAndUpdate(id, data, { new: true });
  return workflow;
};

const deleteWorkflow = async (id) => {
  await Workflow.findByIdAndDelete(id);
};

const addNode = async (id, node) => {
  node._id = new ObjectId();
  await Workflow.findByIdAndUpdate(id, { $push: { nodes: node } });
  return node;
};

const removeNode = async (id, nodeId) => {
  await Workflow.findByIdAndUpdate(id, { $pull: { nodes: { _id: nodeId } } });
};

const findWorkflowByPropertyIntent = async (botId, intentId) => {
  console.time();
  const workflow = await Workflow.aggregate([
    { $unwind: '$nodes' },
    { $match: { 'nodes.intent': intentId } },
    {
      $lookup: {
        from: 'intents',
        let: { id: '$_id', intent: '$nodes.intent' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', intentId],
              },
            },
          },
        ],
        as: 'nodes.intent',
      },
    },
  ]);

  // const workflow = await Workflow.find(
  //   { 'nodes.intent': intentId },
  //   { nodes: { $elemMatch: { intent: intentId } } },
  // ).populate([{ path: 'nodes.intent', model: 'Intent' }]);
  console.timeEnd();
  return workflow;
};

module.exports = {
  findAllWorkflowByCondition,
  findWorkflowByCondition,
  findWorkflowByPropertyIntent,
  findWorkflowAndItem,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addNode,
  removeNode,
};
