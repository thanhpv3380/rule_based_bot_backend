const intentService = require('../services/intent');

const create = async (req, res) => {
  const { bot, user } = req;
  const {
    name,
    patterns,
    isMappingAction,
    mappingAction,
    isActive,
    parameters,
    groupIntent,
  } = req.body;
  const data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntent,
    bot: bot.id,
    createBy: user.id,
  };
  const intent = await intentService.createIntent({ data });
  return res.send({ status: 1, result: intent });
};

const update = async (req, res) => {
  const { bot } = req;
  const {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntent,
  } = req.body;
  const { id } = req.params;
  const data = {
    name,
    isActive,
    patterns,
    isMappingAction,
    mappingAction,
    parameters,
    groupIntent,
  };
  const intent = await intentService.updateIntent(id, bot.id, data);
  return res.send({ status: 1, result: intent });
};

const updatePatternOfIntent = async (req, res) => {
  const { id } = req.params;
  const { pattern } = req.body;
  const intent = await intentService.updatePatternOfIntent({ id, pattern });
  return res.send({ status: 1, result: intent });
};

const getListIntent = async (req, res) => {
  const { bot } = req;
  const intents = await intentService.findIntentByBotId(bot.id);
  return res.send({ status: 1, result: intents });
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

const getParametersIntent = async (req, res) => {
  const { intents } = req.body;
  const parameters = await intentService.getParametersIntent(intents);
  res.send({ status: 1, result: { parameters } });
};

module.exports = {
  create,
  update,
  updatePatternOfIntent,
  removeUsersay,
  getListIntent,
  getIntent,
  deleteIntent,
  addUsersay,
  addParameter,
  removeParameter,
  getParametersIntent,
};
