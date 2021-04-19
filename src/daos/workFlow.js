const {
  Types: { ObjectId },
} = require('mongoose');
const WorkFlow = require('../models/workFlow');
const { findAll, findByCondition } = require('../utils/db');

const findAllWorkFlowByCondition = async ({
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
    model: WorkFlow,
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

const findWorkFlowByCondition = async ({ condition, fields, populate }) => {
  const intent = await findByCondition(WorkFlow, condition, fields, populate);
  return intent;
};

const createWorkFlow = async (data) => {
  const workFlow = await WorkFlow.create(data);
  return workFlow;
};

const updateWorkFlow = async (id, data) => {
  const workFlow = await WorkFlow.findByIdAndUpdate(id, data, { new: true });
  return workFlow;
};

const addNode = async (id, node) => {
  node._id = new ObjectId();
  await WorkFlow.findByIdAndUpdate(id, { $push: { nodes: node } });
  return node;
};

const removeNode = async (id, nodeId) => {
  await WorkFlow.findByIdAndUpdate(id, { $pull: { nodes: { _id: nodeId } } });
};

module.exports = {
  findAllWorkFlowByCondition,
  findWorkFlowByCondition,
  createWorkFlow,
  updateWorkFlow,
  addNode,
  removeNode,
};
