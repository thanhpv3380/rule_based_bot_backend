/* eslint-disable no-console */
const outputConsumer = require('./outputConsumer');
const logMessageConsumer = require('./logMessageConsumer');

function consumer(connection) {
  connection.createChannel((err, channel) => {
    channel.on('error', (channelError) => {
      console.error('[RabbitMQ Channel ERROR]', channelError);
    });

    channel.on('close', () => {
      console.error('RabbitMQ Channel closed');
    });

    outputConsumer(channel);
    logMessageConsumer(channel);
  });
}

module.exports = consumer;
