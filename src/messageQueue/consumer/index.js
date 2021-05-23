/* eslint-disable no-console */
const outputConsumer = require('./outputConsumer');
const logMessageConsumer = require('./logMessageConsumer');
const userConummer = require('./userConsumer');
const test = require('./testSendMessage');

function consumer(connection) {
  connection.createChannel((err, channel) => {
    channel.on('error', (channelError) => {
      console.error('[RabbitMQ Channel ERROR]', channelError);
    });

    channel.on('close', () => {
      console.error('RabbitMQ Channel closed');
    });

    logMessageConsumer(channel);
    userConummer(channel);
    test(channel);
    outputConsumer(channel);
  });
}

module.exports = consumer;
