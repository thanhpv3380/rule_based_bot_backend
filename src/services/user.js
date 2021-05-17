const userDao = require('../daos/user');

const findAllUser = async ({ key }) => {
  const { data, metadata } = await userDao.findAllUser({
    key,
    searchFields: ['email'],
  });

  return { data, metadata };
};

module.exports = { findAllUser };
