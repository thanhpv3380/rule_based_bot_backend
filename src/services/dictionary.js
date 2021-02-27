/* eslint-disable radix */
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');

const dictionaryDao = require('../daos/dictionary');

const findAllDictionary = async ({ botId }) => {
  const dictionaries = await dictionaryDao.findAllDictionary(botId, [
    'createBy',
  ]);
  return dictionaries;
};

const findAllDictionaryByCondition = async ({
  botId,
  key,
  searchFields,
  limit,
  offset,
  fields,
  sort,
  query,
}) => {
  const { data, metadata } = await dictionaryDao.findAllDictionaryByCondition({
    key,
    searchFields,
    query: { ...query, bot: botId },
    offset,
    limit,
    fields,
    sort,
    populate: ['createBy'],
  });

  return { dictionaries: data, metadata };
};

const findDictionaryById = async (id) => {
  const dictionary = await dictionaryDao.findDictionary({ _id: id }, null, [
    'createBy',
  ]);
  if (!dictionary) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return dictionary;
};

const createDictionary = async ({ acronym, original, userId, botId }) => {
  const dictionaryExists = await dictionaryDao.findDictionary({
    acronym,
  });

  if (dictionaryExists) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const dictionary = await dictionaryDao.createDictionary({
    acronym,
    original,
    userId,
    botId,
  });
  return dictionary;
};

const updateDictionary = async (id, data) => {
  const dictionaryExists = await dictionaryDao.findDictionary({
    _id: id,
  });

  if (!dictionaryExists) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  const dictionary = await dictionaryDao.updateDictionary(id, data);
  return dictionary;
};

const deleteDictionary = async (id) => {
  await dictionaryDao.deleteDictionary(id);
};

module.exports = {
  findAllDictionary,
  findAllDictionaryByCondition,
  findDictionaryById,
  createDictionary,
  updateDictionary,
  deleteDictionary,
};
