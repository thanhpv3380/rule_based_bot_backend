/* eslint-disable no-console */
const outputConsumer = require('./outputConsumer');

function consumer(connection) {
  connection.createChannel((err, channel) => {
    channel.on('error', (channelError) => {
      console.error('[RabbitMQ Channel ERROR]', channelError);
    });

    channel.on('close', () => {
      console.error('RabbitMQ Channel closed');
    });

    outputConsumer(channel);
  });
}

module.exports = consumer;
