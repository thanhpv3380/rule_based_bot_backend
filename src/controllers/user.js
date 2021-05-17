const userService = require('../services/user');

const getAllUser = async (req, res) => {
  const { search } = req.query;
  const { data, metadata } = await userService.findAllUser({
    key: search,
  });
  return res.send({ status: 1, result: { accounts: data, metadata } });
};

module.exports = { getAllUser };
