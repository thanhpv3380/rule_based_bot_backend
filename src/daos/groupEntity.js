const {
  Types: {ObjectId},
} = require('mongoose');
const GroupEntity = require('../models/groupEntity');
const {findByCondition} = require('../utils/db');

const findAllGroupEntityAndItem = async ({keyword, botId}) => {
  const groupEntities = await GroupEntity.aggregate([
    {
      $match: {
        bot: ObjectId(botId),
        name: {$regex: keyword, $options: 'g'},
      },
    },
    {
      $lookup: {
        from: 'entities',
        let: {id: '$_id'},
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$groupEntity', '$$id'],
              },
            },
          },
          {
            $match: {name: {$regex: keyword, $options: 'g'}},
          },
        ],
        as: 'children',
      },
    },
    {$sort: {groupType: -1}},
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
        'children.groupEntity': 1,
      },
    },
  ]);
  return groupEntities;
};

const findGroupEntityByCondition = async (condition, fields, populate) => {
  const groupEntity = await findByCondition(
    GroupEntity,
    condition,
    fields,
    populate,
  );
  return groupEntity;
};

const createGroupEntity = async ({name, botId, groupType}) => {
  const groupEntity = await GroupEntity.create({
    name,
    bot: botId,
    groupType,
  });
  return groupEntity;
};

const updateGroupEntity = async (id, data) => {
  const groupEntity = await GroupEntity.findByIdAndUpdate(id, data, {
    new: true,
  });
  return groupEntity;
};

const deleteGroupEntity = async (id) => {
  await GroupEntity.findByIdAndDelete(id);
};

module.exports = {
  findAllGroupEntityAndItem,
  findGroupEntityByCondition,
  createGroupEntity,
  updateGroupEntity,
  deleteGroupEntity,
};
