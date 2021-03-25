const entityService = require('../services/entity');

const getAllEntityByBotId = async (req, res) => {
  const { bot } = req;
  const { keyword } = req.query;
  const entities = await entityService.findAllEntityByBotId({
    keyword,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { entities } });
};

const getEntityById = async (req, res) => {
  const { id } = req.params;
  const entity = await entityService.findEntityById(id);
  return res.send({ status: 1, result: { entity } });
};

const createEntity = async (req, res) => {
  const { bot, user } = req;
  const { name, groupEntity, type, pattern, synonyms, patterns } = req.body;
  const entity = await entityService.createEntity({
    name,
    type,
    pattern,
    synonyms,
    patterns,
    userId: user.id,
    groupEntityId: groupEntity,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { entity } });
};

const updateEntity = async (req, res) => {
  const { id } = req.params;
  const { name, groupEntity, type, pattern, synonyms, patterns } = req.body;
  const { bot } = req;
  const entity = await entityService.updateEntity({
    id,
    name,
    type,
    pattern,
    synonyms,
    patterns,
    groupEntityId: groupEntity,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { entity } });
};

const deleteEntity = async (req, res) => {
  const { id } = req.params;
  await entityService.deleteEntity(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllEntityByBotId,
  getEntityById,
  createEntity,
  updateEntity,
  deleteEntity,
};
