const botService = require('../services/bot');

const create = async (req, res) => {
  const { user } = req;
  const { name } = req.body;
  const bot = await botService.createBot({ name, createBy: user.id });
  return res.send({ status: 1, result: bot });
};

const update = async (req, res) => {
  const { name, userId } = req.body;
  const { botId } = req.param;
  const data = {
    name,
    userId,
  };
  const bot = await botService.updateBot({ botId, data });
  return res.send({ status: 1, result: bot });
};

const getBot = async (req, res) => {
  const { id } = req.param;
  const bot = await botService.findBotById(id);
  res.send({ status: 1, result: bot });
};

const getBots = async (req, res) => {
  const { name } = req.query;
  const { bots, metadata } = await botService.findAllBot(name);
  res.send({ status: 1, result: { bots, metadata } });
};

module.exports = { create, update, getBot, getBots };
