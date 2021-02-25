const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const dictionaryDao = require('../daos/dictionary');

const findAllDictionary = async (id) => {
  const dictionaries = await dictionaryDao.findAllDictionary(id);
  return { dictionaries, metadata: { total: dictionaries.length } };
};

const findDictionaryById = async (id) => {
  const dictionary = await dictionaryDao.findGroupActionById({ id });
  if (!dictionary) {
    throw new CustomError(errorCodes.DICTIONARY_NOT_EXIST);
  }
  return dictionary;
};

const createDictionary = async ({ synonym, original, userId, botId }) => {
  const dictionaryExists = await dictionaryDao.findDictionaryBySynonym({
    synonym,
  });
  if (dictionaryExists) {
    throw new CustomError(errorCodes.DICTIONARY_EXIST);
  }
  const dictionary = await dictionaryDao.createDictionary({
    synonym,
    original,
    userId,
    botId,
  });
  return dictionary;
};

const updateDictionary = async ({ id, synonym, original }) => {
  const dictionaryExists = await dictionaryDao.findDictionaryBySynonym({
    synonym,
  });
  if (dictionaryExists) {
    throw new CustomError(errorCodes.DICTIONARY_EXIST);
  }
  const dictionary = await dictionaryDao.updateDictionary({ id, original });
  return dictionary;
};

const deleteDictionary = async (id) => {
  await dictionaryDao.deleteDictionary(id);
};

module.exports = {
  findAllDictionary,
  findDictionaryById,
  createDictionary,
  updateDictionary,
  deleteDictionary,
};
