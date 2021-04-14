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

module.exports = {
  findAllWorkflowByCondition,
  findWorkflowByCondition,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
};
