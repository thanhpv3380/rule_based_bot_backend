const Dictionary = require('../models/dictionary');

const findAllDictionary = async (id) => {
  const dictionaries = await Dictionary.findById({ bot: id });
  return dictionaries;
};

const findDictionaryBySynonym = async ({ synonym }) => {
  const dictionary = await Dictionary.findOne({ synonym });
  return dictionary;
};

const createDictionary = async ({ synonym, original, userId, botId }) => {
  const dictionary = await Dictionary.create({
    synonym,
    original,
    createBy: userId,
    bot: botId,
  });
  return dictionary;
};

const updateDictionary = async ({ id, original }) => {
  const dictionary = await Dictionary.updateOne(
    { _id: id },
    {
      original,
    },
  );
  return dictionary;
};

const deleteDictionary = async (id) => {
  await Dictionary.deleteOne({ _id: id });
};

module.exports = {
  findAllDictionary,
  findDictionaryBySynonym,
  createDictionary,
  updateDictionary,
  deleteDictionary,
};
