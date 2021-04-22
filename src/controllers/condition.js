const conditionService = require('../services/condition');

const create = async (req, res) => {
  const { user, bot } = req;
  const { operator, conditions } = req.body;
  const data = {
    operator,
    conditions,
    bot: bot.id,
    createBy: user.id,
  };
  const condition = await conditionService.createCondition(data);
  return res.send({ status: 1, result: condition });
};

const update = async (req, res) => {
  const { operator, conditions } = req.body;
  const { id } = req.params;
  const data = {
    operator,
    conditions,
  };
  const condition = await conditionService.updateCondition(id, data);
  return res.send({ status: 1, result: condition });
};

const getConditionById = async (req, res) => {
  const { id } = req.params;
  const condition = await conditionService.findById(id);
  return res.send({ status: 1, result: condition });
};

module.exports = {
  create,
  update,
  getConditionById,
};
