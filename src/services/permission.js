/* eslint-disable radix */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { ROLE_EDITOR } = require('../constants/index');
const permissionDao = require('../daos/permission');

const findAllPermissionByBot = async ({ botId }) => {
  const { data } = await permissionDao.findAllPermission({
    query: { bot: botId },
    sort: ['createdAt_asc'],
    populate: ['user'],
  });

  return data;
};

const findPermissionById = async (id) => {
  const permission = await permissionDao.findPermission({ _id: id });
  if (!permission) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return permission;
};

const createPermission = async ({ userId, role, botId }) => {
  const permission = await permissionDao.createPermission({
    user: userId,
    role: role || ROLE_EDITOR,
    bot: botId,
  });
  return permission;
};

const deletePermission = async (id) => {
  await permissionDao.deletePermission(id);
};

module.exports = {
  findAllPermissionByBot,
  findPermissionById,
  createPermission,
  deletePermission,
};
