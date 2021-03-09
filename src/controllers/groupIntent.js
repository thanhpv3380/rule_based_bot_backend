const groupIntentService = require('../services/groupIntent');

const searchItem = async (req, res) => {
  const { keyword, key, searchFields, limit, offset, fields, sort } = req.query;
  const { bot } = req;
  const {
    groupIntents,
    metadata,
  } = await groupIntentService.findAllGroupAndItem(
    bot.id,
    keyword,
    key,
    searchFields,
    limit,
    offset,
    fields,
    sort,
  );
  return res.send({ status: 1, results: { groupIntents, metadata } });
};

const getAllGroupIntent = async (req, res) => {
  const { keyword } = req.query;
  const { bot } = req;
  const groupIntents = await groupIntentService.findAllGroupAndItem(
    keyword,
    bot.id,
  );
  return res.send({
    status: 1,
    results: { groupIntents, metadata: groupIntents.length },
  });
};

const getGroupIntentById = async (req, res) => {
  const { id } = req.params;
  const groupIntent = await groupIntentService.findGroupIntentById(id);
  return res.send({ status: 1, results: groupIntent });
};

const createGroupIntent = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupIntent = await groupIntentService.createGroupIntent({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, results: groupIntent });
};

const updateGroupIntent = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const groupIntent = await groupIntentService.updateGroupIntent({ id, name });
  return res.send({ status: 1, result: groupIntent });
};

const deleteGroupIntent = async (req, res) => {
  const { id } = req.params;
  await groupIntentService.deleteGroupIntent(id);
  return res.send({ status: 1 });
};

module.exports = {
  searchItem,
  getAllGroupIntent,
  getGroupIntentById,
  createGroupIntent,
  updateGroupIntent,
  deleteGroupIntent,
};
