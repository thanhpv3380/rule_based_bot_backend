// const redisClient = require('redis');
// const asyncMiddleware = require('./async');
// const chatbotService = require('../services/chatbot');

// const client = redisClient.createClient(6379);

// const checkCacheUsersay = (req, res, next) => {
//   const { bot } = req;
//   const { usersay } = req.query;
//   // client.lpushAsync();
//   client.get(bot.id, async (e, data) => {
//     if (data) {
//       const response = await chatbotService.handleUsersaySendAgain(
//         bot.id,
//         JSON.parse(data),
//         usersay,
//         client,
//       );
//       res.send({ status: 1, result: response });
//     } else {
//       next();
//     }
//   });
// };

// module.exports = {
//   checkCacheUsersay: asyncMiddleware(checkCacheUsersay),
// };
