const {
  Types: { ObjectId },
} = require('mongoose');
const GroupIntent = require('../models/groupIntent');
const { findAll, findByCondition } = require('../utils/db');

const findAllGroupIntentAndItem = async ({
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

const findGroupIntentByCondition = async (condition, fields, populate) => {
  const groupIntent = await findByCondition(
    GroupIntent,
    condition,
    fields,
    populate,
  );
  return groupIntent;
};

const createGroupIntent = async ({ name, botId, groupType }) => {
  const groupIntent = await GroupIntent.create({
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

const getGroupIntents = async (botId) => {
  const groupIntents = await GroupIntent.aggregate([
    {
      $match: { bot: ObjectId(botId) },
    },
    {
      $lookup: {
        from: 'intents',
        localField: '_id',
        foreignField: 'groupIntent',
        as: 'children',
      },
    },
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

module.exports = {
  findAllGroupIntentAndItem,
  findGroupIntentByCondition,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
  getGroupIntents,
};
