const {
  Types: { ObjectId },
} = require('mongoose');
const GroupAction = require('../models/groupAction');
const { findByCondition } = require('../utils/db');

const findAllGroupActionAndItem = async ({ keyword, botId }) => {
  const groupActions = await GroupAction.aggregate([
    {
      $match: { bot: ObjectId(botId) },
    },

    {
      $lookup: {
        from: 'actions',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$groupAction', '$$id'],
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
        'children.groupAction': 1,
      },
    },
  ]);
  return groupActions;
};

const findGroupActionByCondition = async (condition, fields, populate) => {
  const groupAction = await findByCondition(
    GroupAction,
    condition,
    fields,
    populate,
  );
  return groupAction;
};

const createGroupAction = async ({ name, botId, groupType }) => {
  const groupAction = await GroupAction.create({
    name,
    bot: botId,
    groupType,
  });
  return groupAction;
};

const updateGroupAction = async (id, data) => {
  const groupAction = await GroupAction.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupAction;
};

const deleteGroupAction = async (id) => {
  await GroupAction.findByIdAndDelete(id);
};

module.exports = {
  findAllGroupActionAndItem,
  findGroupActionByCondition,
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
};
