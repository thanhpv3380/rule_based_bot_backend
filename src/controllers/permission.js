const permissionService = require('../services/permission');

const getAllPermissionByBot = async (req, res) => {
  const { bot } = req;

  const permissions = await permissionService.findAllPermissionByBot({
    botId: bot.id,
  });
  return res.send({ status: 1, result: { permissions } });
};

const getPermissionById = async (req, res) => {
  const { id } = req.params;
  const permission = await permissionService.findPermissionById(id);
  return res.send({ status: 1, result: { permission } });
};

const createPermission = async (req, res) => {
  const { bot } = req;
  const { userId } = req.body;
  const permission = await permissionService.createPermission({
    userId,
    botId: bot.id,
  });
  return res.send({ status: 1, result: { permission } });
};

const deletePermission = async (req, res) => {
  const { id } = req.params;
  await permissionService.deletePermission(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllPermissionByBot,
  getPermissionById,
  createPermission,
  deletePermission,
};
