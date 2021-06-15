const botService = require('../services/bot');

const getAllBotByRole = async (req, res) => {
  const { sort } = req.query;
  const { user } = req;
  const { bots, metadata } = await botService.findAllBotByRole({
    userId: user._id,
    sort,
  });

  return res.send({ status: 1, result: { bots, metadata } });
};

const addPermission = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log(id);
  const bot = await botService.addPermission(id, data);
  return res.send({ status: 1, result: { bot } });
};

const deletePermission = async (req, res) => {
  const { id, userId } = req.params;
  const bot = await botService.deletePermission(id, userId);
  return res.send({ status: 1, result: { bot } });
};

const getBotById = async (req, res) => {
  const { id: botId } = req.params;
  const { user } = req;
  const bot = await botService.findBotById({ botId, userId: user._id });
  return res.send({ status: 1, result: { bot } });
};

const createBot = async (req, res) => {
  const { user } = req;
  const { name, description } = req.body;
  const bot = await botService.createBot(user._id, { name, description });
  return res.send({ status: 1, result: { bot } });
};

const updateBot = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { user } = req;
  const bot = await botService.updateBot(id, user._id, data);
  return res.send({ status: 1, result: { bot } });
};

const deleteBot = async (req, res) => {
  const { id } = req.params;
  await botService.deleteBot(id);
  return res.send({ status: 1 });
};

const getBotByToken = async (req, res) => {
  const { botToken } = req.query;
  const bot = await botService.findBotByToken(botToken);
  return res.send({ status: 1, result: bot });
};

const getRoleInBot = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const role = await botService.findRoleInBot({ botId: id, userId: user._id });
  return res.send({ status: 1, result: { role } });
};

const getExportFile = async (req, res) => {
  const { id } = req.params;
  const { data, name } = await botService.getFileExportOfBot(id);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${name}.zip`);
  res.set('Content-Length', data.length);
  res.send(data);
};

const importFile = async (req, res) => {
  const { id } = req.params;
  const file = req.files;
  const data = await botService.importFile(id, file);
  return res.send({ status: 1, result: data });
};

module.exports = {
  getAllBotByRole,
  getBotById,
  createBot,
  updateBot,
  deleteBot,
  getBotByToken,
  getRoleInBot,
  addPermission,
  deletePermission,
  getExportFile,
  importFile,
};
