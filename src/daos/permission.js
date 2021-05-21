const Permission = require('../models/permission');
const { findAll, findByCondition } = require('../utils/db');

const findAllPermission = async ({ query, sort, fields, populate }) => {
  const { data, metadata } = await findAll({
    model: Permission,
    query,
    sort,
    fields,
    populate,
  });
  return {
    data,
    metadata,
  };
};

const findPermission = async (condition, fields, populate) => {
  const permission = await findByCondition(
    Permission,
    condition,
    fields,
    populate,
  );
  return permission;
};

const createPermission = async ({ user, bot, role }) => {
  const permission = await Permission.create({
    user,
    bot,
    role,
  });
  return permission;
};

const deletePermission = async (id) => {
  await Permission.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await Permission.remove(condition);
};

module.exports = {
  findAllPermission,
  findPermission,
  createPermission,
  deletePermission,
  deleteByCondition,
};
