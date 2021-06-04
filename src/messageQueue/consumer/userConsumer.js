const authService = require('../../services/auth');
const {
  mqQueues: { USER_EXCHANGE },
} = require('../../configs');

module.exports = (channel) => {
  channel.assertExchange(USER_EXCHANGE, 'fanout', {
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
      channel.bindQueue(q.queue, USER_EXCHANGE, '');

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
};
