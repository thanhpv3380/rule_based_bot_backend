/* eslint-disable no-console */
const chatConsumer = require('./chatConsumer');
const outputConsumer = require('./outputConsumer');

function consumer(connection) {
  connection.createChannel((err, channel) => {
    channel.on('error', (channelError) => {
      console.error('[RabbitMQ Channel ERROR]', channelError);
    });

    channel.on('close', () => {
      console.error('RabbitMQ Channel closed');
    });

    chatConsumer(channel);
    outputConsumer(channel);
  });
}

module.exports = consumer;
