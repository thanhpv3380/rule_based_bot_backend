const entityService = require('../services/entity');

const getAllEntities = async (req, res) => {
  const entities = await entityService.findAllEntity();
  return res.send({ status: 1, results: { entities } });
};

const createEntity = async (req, res) => {
  const { user } = req;

  const { name, pattern } = req.body;
  const entity = await entityService.createEntity({
    name,
    pattern,
    createBy: user.id,
  });
  return res.send({ status: 1, results: entity });
};

module.exports = {
  createEntity,
  getAllEntities,
};
