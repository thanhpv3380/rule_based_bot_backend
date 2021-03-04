const GroupIntent = require('../models/groupIntent');
const { findAll } = require('../utils/db');

const findAllGroupAndItem = async ({
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
  return {
    data,
    metadata,
  };
};

// const findAllGroupAndItem = async ({ botId, keyword }) => {
//   const groupIntents = await GroupIntent.find({
//     bot: botId,
//   }).populate([
//     {
//       path: 'intents',
//       match: { name: { $regex: keyword } },
//       select: 'name id',
//     },
//   ]);
//   return groupIntents;
// };

const findGroupIntentById = async ({ id }) => {
  const groupIntents = await GroupIntent.findOne({
    _id: id,
    function(err, groupIntent) {
      groupIntent.awesome = true;
      groupIntent.index(function (err, res) {
        return res;
      });
    },
  }).populate(['Intent']);
  return groupIntents;
};

const findGroupIntentByName = async ({ name }) => {
  const groupIntents = await GroupIntent.findOne({
    name,
    function(err, groupIntent) {
      groupIntent.awesome = true;
      groupIntent.index(function (err, res) {
        return res;
      });
    },
  });
  return groupIntents;
};

const createGroupIntent = async ({ name, botId, isGroup }) => {
  const groupIntent = await GroupIntent.create({
    name,
    bot: botId,
    isGroup,
  });
  return groupIntent;
};

const updateGroupIntent = async ({ id, name }) => {
  const groupIntent = await GroupIntent.updateOne({ _id: id }, { name });
  return groupIntent;
};

const deleteGroupIntent = async (id) => {
  await GroupIntent.deleteOne({ _id: id });
};

const addIntentInGroup = async (groupIntentId, intentId) => {
  const groupIntent = await GroupIntent.updateOne(
    { _id: groupIntentId },
    { $push: { intents: intentId } },
  );
  return groupIntent;
};

const removeIntentInGroup = async (groupIntentId, intentId) => {
  const groupIntent = await GroupIntent.updateOne(
    { _id: groupIntentId },
    { $pull: { intents: intentId } },
  );
  return groupIntent;
};

module.exports = {
  findAllGroupAndItem,
  // findAllGroupAndItem,
  findGroupIntentById,
  findGroupIntentByName,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
  addIntentInGroup,
  removeIntentInGroup,
};
