const chatbotService = require('../services/chatbot');

const getAction = async (req, res) => {
  const { bot, user } = req;
  const { usersay } = req.query;
  const response = await chatbotService.handleUsersaySend(
    usersay,
    bot.id,
    user.id,
  );

  res.send({ status: 1, result: response });
};
module.exports = {
  getAction,
};
