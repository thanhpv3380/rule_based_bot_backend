/* eslint-disable radix */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const entityDao = require('../daos/entity');

const findAllEntity = async () => {
  const entities = await entityDao.findAllEntity();
  return entities;
};

// const findDictionaryById = async (id) => {
//   const dictionary = await dictionaryDao.findDictionary({ _id: id }, null, [
//     'createBy',
//   ]);
//   if (!dictionary) {
//     throw new CustomError(errorCodes.NOT_FOUND);
//   }
//   return dictionary;
// };

const createEntity = async ({ name, pattern, createBy }) => {
  const entityExists = await entityDao.findEntity(name);

  if (entityExists) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const entities = await entityDao.createEntity({
    name,
    pattern,
    createBy,
  });
  return entities;
};

module.exports = {
  findAllEntity,
  createEntity,
};
