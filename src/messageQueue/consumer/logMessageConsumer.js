/* eslint-disable no-console */
const messageService = require('../../services/message');
const {
  mqQueues: { LOG_MESSAGE_QUEUE },
} = require('../../configs');

module.exports = (channel) => {
  channel.assertQueue(LOG_MESSAGE_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(LOG_MESSAGE_QUEUE, (message) => {
    channel.ack(message);
    const content = JSON.parse(message.content.toString('utf8'));
    // const {
    //   message: { text },
    //   sessionId,
    //   resultQueue,
    //   accessToken,
    // } = content;
    try {
      messageService.handleLogMessage(content);
    } catch (error) {
      console.log(error);
    }
  });
};
