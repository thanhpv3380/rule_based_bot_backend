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
  const workflow = await Workflow.aggregate([
    { $unwind: '$nodes' },
    { $match: { 'nodes.intent': intentId } },
    {
      $lookup: {
        from: 'workflows',
        let: { intent: '$nodes.intent' },
        pipeline: [
          {
            $lookup: {
              from: 'intents',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$intent', '$$id'],
                    },
                  },
                },
              ],
              as: 'intent',
            },
          },
          {
            $match: {
              $expr: {
                $eq: ['$$intent', intentId],
              },
            },
          },
        ],
        as: 'nodes',
      },
    },
    // {
    //   $lookup: {
    //     from: 'workflows',
    //     localField: 'children',
    //     foreignField: 'nodes._id',
    //     as: 'children',
    //   },
    // },
  ]);
  return workflow;
};

module.exports = {
  findAllWorkflowByCondition,
  findWorkflowByCondition,
  findWorkflowByPropertyIntent,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addNode,
  removeNode,
};
