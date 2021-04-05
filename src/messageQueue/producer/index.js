function producer(connection) {
  connection.createChannel((err, channel) => {
    channel.on('error', channelError => {
      console.error('[RabbitMQ Channel ERROR]', channelError);
    });

    channel.on('close', () => {
      console.error('RabbitMQ Channel closed');
    });

    global.PRODUCER = channel;
  });
}

module.exports = producer;
