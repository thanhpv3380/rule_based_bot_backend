const GroupIntent = require('../models/groupIntent');

const findAllGroupIntent = async (id) => {
  await GroupIntent.search({ match_all: {} }, async function(err, result) {
    let groupIntents = await result.hits.hits.map((data) => data);
      // console.log(groupIntents, ' test Dao groupIntents  ', groupIntents.length);
      return groupIntents;
  });
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
    name: name,
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
    intents : intentId
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
    { groupIntentId },
    { $pull: { intents: intentId } },
  );
  return groupIntent;
};

module.exports = {
  findAllGroupIntent,
  findGroupIntentById,
  findGroupIntentByName,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
  addIntentInGroup,
  removeIntentInGroup,
};
