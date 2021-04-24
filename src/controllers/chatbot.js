const chatbotService = require('../services/chatbot');

const getAction = async (req, res) => {
  const { bot } = req;
  const { usersay } = req.query;
  const response = await chatbotService.getAction(
    `TEST${bot.id}`,
    usersay,
    null,
  );

  res.send({ status: 1, result: response });
};
module.exports = {
  getAction,
};
