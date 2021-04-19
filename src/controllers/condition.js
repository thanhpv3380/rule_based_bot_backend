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
  const workFlow = await conditionService.createCondition(data);
  return res.send({ status: 1, result: workFlow });
};

const update = async (req, res) => {
  const { operator, conditions } = req.body;
  const { id } = req.params;
  const data = {
    operator,
    conditions,
  };
  const workFlow = await conditionService.updateCondition(id, data);
  return res.send({ status: 1, result: workFlow });
};

const getConditionById = async (req, res) => {
  const { bot } = req;
  const { id } = req.params;
  const workFlow = await conditionService.findById(id, bot.id);
  return res.send({ status: 1, result: workFlow });
};

module.exports = {
  create,
  update,
  getConditionById,
};