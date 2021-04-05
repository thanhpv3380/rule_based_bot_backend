/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const redisClient = require('redis');
const amqp = require('amqplib');
const chatbotService = require('../services/chatbot');

const client = redisClient.createClient(6379);

amqp
  .connect('amqp://localhost')
  .then((conn) => {
    process.once('SIGINT', () => {
      conn.close();
    });
    return conn.createChannel().then((ch) => {
      const exReceive = 'receive_rule_bot_ex';
      const queReceive = 'receive_rule_bot_qu';

      let ok = ch.assertExchange(exReceive, 'direct', { durable: true });

      ok = ok.then(() => {
        return ch.assertQueue(queReceive);
      });

      ok = ok.then((qok) => {
        const { queue } = qok;
        ch.bindQueue(queue, exReceive, queReceive).then(() => {
          return queue;
        });
      });

      ok = ok.then((queue) => {
        return ch.consume(queue, logMessage, { noAck: true });
      });
      return ok.then(() => {
        console.log(' [*] Waiting for logs. To exit press CTRL+C.');
      });

      function logMessage(msg) {
        console.log(
          " [x] %s:'%s'",
          msg.fields.routingKey,
          msg.content.toString(),
        );

        const { usersay } = JSON.parse(msg.content.toString());

        const botId = '603325225c597b1fb4c9baa6';

        client.get(botId, async (e, data) => {
          let response;
          if (data) {
            response = await chatbotService.handleUsersaySendAgain(
              botId,
              JSON.parse(data),
              usersay,
              client,
            );
          } else {
            response = await chatbotService.handleUsersaySend(
              usersay,
              botId,
              '6032908345ce3f4758ddfcf9',
            );
          }
          console.log(response);
          ch.sendToQueue('send_mgs', Buffer.from(JSON.stringify(response)));
        });
      }
    });
  })
  .catch(console.warn);
