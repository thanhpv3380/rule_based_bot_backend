const groupEntityService = require('../services/groupEntity');

const getAllGroupEntityAndItem = async (req, res) => {
  const { keyword } = req.body;
  const { bot } = req;
  const groupEntities = await groupEntityService.findAllGroupEntityAndItem({
    keyword,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupEntities } });
};

const getGroupEntityById = async (req, res) => {
  const { id } = req.params;
  const groupEntity = await groupEntityService.findGroupEntityById(id);
  return res.send({ status: 1, result: { groupEntity } });
};

const createGroupEntity = async (req, res) => {
  const { bot } = req;
  const { name } = req.body;
  const groupEntity = await groupEntityService.createGroupEntity({
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupEntity } });
};

const updateGroupEntity = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { bot } = req;
  const groupEntity = await groupEntityService.updateGroupEntity({
    id,
    name,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { groupEntity } });
};

const deleteGroupEntity = async (req, res) => {
  const { id } = req.params;
  await groupEntityService.deleteGroupEntity(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllGroupEntityAndItem,
  getGroupEntityById,
  createGroupEntity,
  updateGroupEntity,
  deleteGroupEntity,
};
