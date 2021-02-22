const dictionaryService = require('../services/dictionary');

const getAllDictionary = async (req, res) => {
  const { bot } = req;
  const { dictionaries, metadata } = await dictionaryService.findAllDictionary(
    bot.id,
  );
  return res.send({ status: 1, results: { dictionaries, metadata } });
};

const getDictionaryById = async (req, res) => {
  const { id } = req.params;
  const dictionary = await dictionaryService.findDictionaryById(id);
  return res.send({ status: 1, results: dictionary });
};

const createDictionary = async (req, res) => {
  const { bot, user } = req;

  const { synonym, original } = req.body;
  const dictionary = await dictionaryService.createDictionary({
    synonym,
    original,
    botId: bot.id,
    userId: user.id,
  });
  return res.send({ status: 1, results: dictionary });
};

const updateDictionary = async (req, res) => {
  const { id } = req.params;
  const { synonym, original } = req.body;
  const dictionary = await dictionaryService.updateDictionary({
    id,
    synonym,
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
