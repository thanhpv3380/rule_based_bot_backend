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
        ],
        as: 'nodes',
      },
    },
  ]);
  await Workflow.populate(workflow, [
    {
      path: 'nodes.intent',
      model: 'Intent',
    },
    {
      path: 'nodes.condition',
      model: 'Condition',
      populate: [
        {
          path: 'conditions.parameter',
        },
      ],
    },
    {
      path: 'nodes.action',
      model: 'Action',
    },
  ]);
  return workflow[0];
};

const findWorkflowByCondition = async (condition, fields, populate) => {
  const workflow = await findByCondition(Workflow, condition, fields, populate);
  return workflow;
};

const createWorkflow = async (data) => {
  const workflow = await Workflow.create(data);
  return workflow;
};

const updateWorkflow = async (id, data) => {
  const workflow = await Workflow.findByIdAndUpdate(id, data, { new: true });
  return workflow;
};

const deleteWorkflow = async (id) => {
  await Workflow.findByIdAndDelete(id);
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

const deleteByCondition = async (condition) => {
  await Workflow.remove(condition);
};

module.exports = {
  findAllWorkflowByCondition,
  findWorkflowByCondition,
  findWorkflowByPropertyIntent,
  findWorkflowAndItem,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  deleteByCondition,
};
