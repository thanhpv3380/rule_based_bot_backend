/* eslint-disable no-console */
const chatbotService = require('../../services/chatbot');
const {
  mqQueues: { OUTPUT_QUEUE },
} = require('../../configs');

module.exports = (channel) => {
  channel.assertQueue(OUTPUT_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(OUTPUT_QUEUE, (message) => {
    channel.ack(message);
    const content = JSON.parse(message.content.toString('utf8'));
    console.log(content);
    try {
      console.time();
      chatbotService.handleMessage(content);
      console.timeEnd();
      // require('../responseHandler').handleResponse(response);
      // channel.sendToQueue(resultQueue, Buffer.from(JSON.stringify(response)));
    } catch (error) {
      console.log(error);
    }
  });
};
