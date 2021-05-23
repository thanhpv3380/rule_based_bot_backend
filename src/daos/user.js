const {
  Types: { ObjectId },
} = require('mongoose');
const User = require('../models/user');
const { findAll, findByCondition } = require('../utils/db');

const findAllUser = async ({ key, searchFields, query }) => {
  const { data, metadata } = await findAll({
    model: User,
    key,
    searchFields,
    query,
  });
  return {
    data,
    metadata,
  };
};

const findUserByCondition = async (condition, fields, populate) => {
  const user = await findByCondition(User, condition, fields, populate);
  return user;
};

const createUser = async ({ email, name, password }) => {
  const user = await User.create({ email, name, password });
  return user;
};

const findUser = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const user = await User.findById(condition);
    return user;
  }

  if (typeof condition === 'object' && condition !== null) {
    const user = await User.findOne(condition);
    return user;
  }

  return null;
};

const updateUser = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true });
  return user;
};

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

const findByIdAndUpdate = async (userId, id) => {
  await User.findByIdAndUpdate(userId, { $push: { bots: id } });
};

module.exports = {
  findAllUser,
  createUser,
  findUser,
  updateUser,
  deleteUser,
  findByIdAndUpdate,
  findUserByCondition,
};
