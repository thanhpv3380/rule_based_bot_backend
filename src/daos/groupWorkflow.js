const {
  Types: { ObjectId },
} = require('mongoose');
const GroupWorkflow = require('../models/groupWorkFlow');
const { findByCondition, findAll } = require('../utils/db');

const findAllGroupWorkflowByCondition = async ({
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
    model: GroupWorkflow,
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

const findAllGroupWorkflowAndItem = async ({ keyword, botId }) => {
  const groupWorkflows = await GroupWorkflow.aggregate([
    {
      $match: {
        bot: ObjectId(botId),
        name: { $regex: keyword, $options: 'g' },
      },
    },
    {
      $lookup: {
        from: 'workflows',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$groupWorkflow', '$$id'],
              },
            },
          },
          {
            $match: { name: { $regex: keyword, $options: 'g' } },
          },
        ],
        as: 'children',
      },
    },
    { $sort: { groupType: -1 } },
    {
      $project: {
        _id: 1,
        name: 1,
        bot: 1,
        createdAt: 1,
        updatedAt: 1,
        groupType: 1,
        'children._id': 1,
        'children.name': 1,
        'children.groupWorkflow': 1,
      },
    },
  ]);
  return groupWorkflows;
};

const findGroupWorkflowByCondition = async (condition, fields, populate) => {
  const groupWorkflow = await findByCondition(
    GroupWorkflow,
    condition,
    fields,
    populate,
  );
  return groupWorkflow;
};

const createGroupWorkflow = async ({ _id, name, botId, groupType }) => {
  const groupWorkflow = await GroupWorkflow.create({
    _id: _id || new ObjectId(),
    name,
    bot: botId,
    groupType,
  });
  return groupWorkflow;
};

const updateGroupWorkflow = async (id, data) => {
  const groupWorkflow = await GroupWorkflow.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupWorkflow;
};

const deleteGroupWorkflow = async (id) => {
  await GroupWorkflow.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await GroupWorkflow.remove(condition);
};

module.exports = {
  findAllGroupWorkflowByCondition,
  findAllGroupWorkflowAndItem,
  findGroupWorkflowByCondition,
  createGroupWorkflow,
  updateGroupWorkflow,
  deleteGroupWorkflow,
  deleteByCondition,
};
