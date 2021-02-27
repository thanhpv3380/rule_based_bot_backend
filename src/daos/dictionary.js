const Dictionary = require('../models/dictionary');
const { findAll, findByCondition } = require('../utils/db');

const findAllDictionary = async (botId, populate) => {
  const dictionaries = await Dictionary.find({ bot: botId }).populate(populate);
  return dictionaries;
};

const findAllDictionaryByCondition = async ({
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort,
  populate,
}) => {
  const { data, metadata } = await findAll({
    model: Dictionary,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return {
    data,
    metadata,
  };
};

const findDictionary = async (condition, fields, populate) => {
  const dictionary = await findByCondition(
    Dictionary,
    condition,
    fields,
    populate,
  );
  return dictionary;
};

const createDictionary = async ({ acronym, original, userId, botId }) => {
  const dictionary = await Dictionary.create({
    acronym,
    original,
    createBy: userId,
    bot: botId,
  });
  return dictionary;
};

const updateDictionary = async (dictionaryId, data) => {
  const dictionary = await Dictionary.findByIdAndUpdate(dictionaryId, data, {
    new: true,
  });
  return dictionary;
};

const deleteDictionary = async (dictionaryId) => {
  await Dictionary.findByIdAndDelete(dictionaryId);
};

module.exports = {
  findAllDictionary,
  findAllDictionaryByCondition,
  findDictionary,
  createDictionary,
  updateDictionary,
  deleteDictionary,
};
