const entityService = require('../services/entity');

const getAllEntities = async (req, res) => {
  const entities = await entityService.findAllEntity();
  return res.send({ status: 1, results: { entities } });
};

// const getDictionaryById = async (req, res) => {
//   const { id } = req.params;
//   const dictionary = await dictionaryService.findDictionaryById(id);
//   return res.send({ status: 1, results: { dictionary } });
// };

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

// const updateDictionary = async (req, res) => {
//   const { id } = req.params;
//   const { acronym, original } = req.body;
//   const dictionary = await dictionaryService.updateDictionary(id, {
//     acronym,
//     original,
//   });
//   return res.send({ status: 1, results: dictionary });
// };

// const deleteDictionary = async (req, res) => {
//   const { id } = req.params;
//   await dictionaryService.deleteDictionary(id);
//   return res.send({ status: 1 });
// };

module.exports = {
  createEntity,
  getAllEntities,
};
