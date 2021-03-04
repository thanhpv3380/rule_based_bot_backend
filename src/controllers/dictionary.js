const dictionaryService = require('../services/dictionary');

const getAllDictionary = async (req, res) => {
  const { key, searchFields, limit, offset, fields, sort } = req.query;
  const { bot } = req;
  const { dictionaries, metadata } = await dictionaryService.findAllDictionary({
    botId: bot.id,
    key,
    searchFields,
    limit,
    offset,
    fields,
    sort,
  });
  return res.send({ status: 1, results: { dictionaries, metadata } });
};

const getDictionaryById = async (req, res) => {
  const { id } = req.params;
  const dictionary = await dictionaryService.findDictionaryById(id);
  return res.send({ status: 1, results: { dictionary } });
};

const createDictionary = async (req, res) => {
  const { bot, user } = req;

  const { acronym, original } = req.body;
  const dictionary = await dictionaryService.createDictionary({
    acronym,
    original,
    botId: bot.id,
    userId: user.id,
  });
  return res.send({ status: 1, results: dictionary });
};

const updateDictionary = async (req, res) => {
  const { id } = req.params;
  const { acronym, original } = req.body;
  const dictionary = await dictionaryService.updateDictionary(id, {
    acronym,
    original,
  });
  return res.send({ status: 1, results: dictionary });
};

const deleteDictionary = async (req, res) => {
  const { id } = req.params;
  await dictionaryService.deleteDictionary(id);
  return res.send({ status: 1 });
};

module.exports = {
  getAllDictionary,
  getDictionaryById,
  createDictionary,
  updateDictionary,
  deleteDictionary,
};
