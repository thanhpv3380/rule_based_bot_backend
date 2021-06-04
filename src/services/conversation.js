const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const conversationDao = require('../daos/conversation');
const messageDao = require('../daos/message');

const findAllConversationByBotId = async ({ botId }) => {
  const { data } = await conversationDao.findAllConversation({
    query: {
      bot: botId,
    },
  });

  return data;
};

const findConversationAndItemById = async (id) => {
  const conversation = await conversationDao.findConversationAndItem({
    id,
  });
  if (!conversation) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }
  return conversation;
};

module.exports = {
  findAllConversationByBotId,
  findConversationAndItemById,
};
