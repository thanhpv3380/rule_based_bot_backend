const asyncMiddleware = require('./async');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');
const authService = require('../services/auth');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new CustomError(codes.UNAUTHORIZED);

  const [tokenType, accessToken] = authorization.split(' ');
  if (tokenType !== 'Bearer') throw new Error(codes.UNAUTHORIZED);

  const user = await authService.verifyAccessToken(accessToken);
  req.user = user;
  if (['/auths/logout', '/auths/verify'].includes(req.path)) {
    req.accessToken = accessToken;
  }

  return next();
};

const getAgentId = async (req, res, next) => {
  const agentId = req.headers['agent-id'];
  if (!agentId) throw new CustomError(codes.NOT_FOUND);
  const bot = {
    id: agentId,
  };
  req.bot = bot;
  return next();
};

module.exports = {
  auth: asyncMiddleware(auth),
  getAgentId: asyncMiddleware(getAgentId),
};
