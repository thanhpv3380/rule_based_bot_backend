const {
  Types: { ObjectId },
} = require('mongoose');
const GroupIntent = require('../models/groupIntent');
const { findByCondition, findAll } = require('../utils/db');

const findAllGroupIntentByCondition = async ({
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
    model: GroupIntent,
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

const findAllGroupIntentAndItem = async ({ keyword, botId }) => {
  const groupIntents = await GroupIntent.aggregate([
    {
      $match: { bot: ObjectId(botId) },
    },
    {
      $lookup: {
        from: 'intents',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$groupIntent', '$$id'],
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
        'children.groupIntent': 1,
      },
    },
  ]);
  return groupIntents;
};

const findGroupIntentByCondition = async (condition, fields, populate) => {
  const groupIntent = await findByCondition(
    GroupIntent,
    condition,
    fields,
    populate,
  );
  return groupIntent;
};

const createGroupIntent = async ({ _id, name, botId, groupType }) => {
  const groupIntent = await GroupIntent.create({
    _id: _id || new ObjectId(),
    name,
    bot: botId,
    groupType,
  });
  return groupIntent;
};

const updateGroupIntent = async (id, data) => {
  const groupIntent = await GroupIntent.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await GroupIntent.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await GroupIntent.remove(condition);
};

module.exports = {
  findAllGroupIntentByCondition,
  findAllGroupIntentAndItem,
  findGroupIntentByCondition,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
  deleteByCondition,
};
