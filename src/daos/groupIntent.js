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

const createGroupIntent = async ({ name, botId, isGroup, intentId }) => {
  const groupIntent = await GroupIntent.create({
    name,
    bot: botId,
    isGroup,
    intents: intentId,
  });
  return groupIntent;
};

const updateGroupIntent = async ({ id, name }) => {
  const groupIntent = await GroupIntent.findByIdAndUpdate(
    { _id: id },
    { name },
    {
      new: true,
    },
  );
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
    {},
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
