const asyncMiddleware = require('./async');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const getAgentId = async (req, res, next) => {
  const { agentId } = req.headers;
  if (!agentId) throw new CustomError(codes.NOT_FOUND);

  const bot = {};

  req.bot = bot;

  return next();
};

module.exports = {
  getAgentId: asyncMiddleware(getAgentId),
};
