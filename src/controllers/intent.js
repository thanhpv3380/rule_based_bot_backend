const intentService = require('../services/intent');

const create = async (req, res) => {
  const { bot } = req;
  const {
    name,
    patterns,
    isMappingAction,
    mappingAction,
    isActive,
    parameters,
    groupIntentId,
  } = req.body;
  const data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntent: groupIntentId,
    bot: bot.id,
  };
  const intent = await intentService.createIntent(data);
  return res.send({ status: 1, result: intent });
};

const update = async (req, res) => {
  const {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntentId,
  } = req.body;
  const { id } = req.params;
  const data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntentId,
  };
  const intent = await intentService.updateIntent(id, data);
  return res.send({ status: 1, result: intent });
};

const updatePatternOfIntent = async (req, res) => {
  const { id } = req.params;
  const { pattern } = req.body;
  const intent = await intentService.updatePatternOfIntent({ id, pattern });
  return res.send({ status: 1, result: intent });
};

const getIntent = async (req, res) => {
  const { id } = req.params;
  const intent = await intentService.findIntentById(id);
  res.send({ status: 1, result: intent });
};

const deleteIntent = async (req, res) => {
  const { id } = req.params;
  await intentService.deleteIntentById(id);
  res.send({ status: 1 });
};

const removeUsersay = async (req, res) => {
  const { id } = req.params;
  const { pattern } = req.body;
  await intentService.removeUsersayOfIntent(id, pattern);
  res.send({ status: 1 });
};

const addUsersay = async (req, res) => {
  const { id } = req.params;
  const { pattern } = req.body;
  await intentService.addUsersayOfIntent(id, pattern);
  res.send({ status: 1 });
};

const addParameter = async (req, res) => {
  const { id } = req.params;
  const { parameter } = req.body;
  await intentService.addParameterOfIntent(id, parameter);
  res.send({ status: 1 });
};

const removeParameter = async (req, res) => {
  const { id } = req.params;
  const { parameter } = req.body;
  await intentService.removeParameterOfIntent(id, parameter);
  res.send({ status: 1 });
};

const getUsersay = async (req, res) => {
  const { usersay } = req.query;
  console.log(usersay, "controller");
  const intent = await intentService.findUserSay(usersay);
  res.send({ status: 1, result: intent });
};

module.exports = {
  create,
  update,
  updatePatternOfIntent,
  removeUsersay,
  getIntent,
  deleteIntent,
  addUsersay,
  addParameter,
  removeParameter,
  getUsersay,
};