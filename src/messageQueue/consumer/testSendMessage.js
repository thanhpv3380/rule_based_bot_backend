module.exports = (channel) => {
  channel.assertQueue('huyenpk_output_queue', { durable: false });
  channel.prefetch(1);

  channel.consume('huyenpk_output_queue', (message) => {
    channel.ack(message);
    console.log('receive');
    const content = JSON.parse(message.content.toString('utf8'));
    console.log(content);
  });
};
