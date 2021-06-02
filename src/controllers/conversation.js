const conversationService = require('../services/conversation');

const getAllConversationByBotId = async (req, res) => {
  const { bot } = req;
  const conversations = await conversationService.findAllConversationByBotId({
    botId: bot.id,
  });
  return res.send({ status: 1, result: { conversations } });
};

const getConversationById = async (req, res) => {
  const { id } = req.params;
  const conversation = await conversationService.findConversationAndItemById(
    id,
  );
  return res.send({ status: 1, result: { conversation } });
};

module.exports = {
  getAllConversationByBotId,
  getConversationById,
};
