const authService = require('../../services/auth');
const {
  mqQueues: { USER_QUEUE },
} = require('../../configs');

module.exports = (channel) => {
  channel.assertExchange(USER_QUEUE, 'fanout', {
    durable: false,
  });

  channel.assertQueue(
    '',
    {
      exclusive: true,
    },
    (error2, q) => {
      if (error2) {
        throw error2;
      }
      console.log(
        ' [*] Waiting for messages in %s. To exit press CTRL+C',
        q.queue,
      );
      channel.bindQueue(q.queue, USER_QUEUE, '');

      channel.consume(
        q.queue,
        async (message) => {
          const content = JSON.parse(message.content.toString('utf8'));
          console.log(content, 'create user');
          if (content.type === 'CREATE_USER') {
            await authService.createUser(content.user);
          }
        },
        {
          noAck: true,
        },
      );
    },
  );

  //   channel.assertExchange(USER_QUEUE, 'fanout', { durable: false });
  //   channel.prefetch(1);
  //   channel.assertQueue('');
  //   channel.consume(USER_QUEUE, async (message) => {
  //     channel.ack(message);
  //     const content = JSON.parse(message.content.toString('utf8'));
  //     console.log(content, 'create user');
  //     if (content.type === 'CREATE_USER') {
  //       await authService.createUser(content.user);
  //     }
  //   });
};
