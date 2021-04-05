const amqp = require('amqplib/callback_api');
const consumer = require('./consumer');
const producer = require('./producer');
const { mqQueues, responseActionTypes } = require('../../configs');
const { convertUserSay } = require('../userSay');

const {
  RABBITMQ_HOST,
  RABBITMQ_PORT,
  RABBITMQ_USERNAME,
  RABBITMQ_PASSWORD,
} = process.env;

const MQ_URI = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

amqp.connect(MQ_URI, (error, connection) => {
  if (error) {
    console.error('[RabbitMQ ERROR]', error);
    throw error;
  }

  console.log(`Connected to RabbitMQ ${MQ_URI}`);

  consumer(connection);
  producer(connection);
});

function sendMsgToBot({
  appId,
  platform,
  accessToken,
  sessionId,
  userId,
  userSay,
  attachment,
  returnArrayAction,
  zalo,
  facebook,
  viber,
  telegram,
  messageInfo,
  isDev,
  customerInfo = {},
}) {
  const convertedUserSay = convertUserSay(userSay, platform);
  const { name = 'bạn', phoneNumber } = customerInfo;

  const msg = {
    appId,
    sessionId,
    accessToken,
    platform,
    userId,
    userSay: convertedUserSay,
    result_queue_name: mqQueues.OUTPUT_QUEUE,
    zalo,
    facebook,
    viber,
    telegram,
    messageInfo,
    isDev,
    inputMessage: {
      attachment,
    },
    customerInfo: { name, phoneNumber },
    type: returnArrayAction
      ? responseActionTypes.ARRAY_ACTION
      : responseActionTypes.SINGLE_ACTION,
  };
  PRODUCER.sendToQueue(
    'request-normalization-queue',
    Buffer.from(JSON.stringify(msg)),
  );
  console.log('Send mesasge to Bot', JSON.stringify(msg, null, 4));
}

function syncBroadcastToManagementService(type, broadcast) {
  PRODUCER.sendToQueue(
    mqQueues.RESPONSE_CHAT_QUEUE,
    Buffer.from(
      JSON.stringify({
        type,
        responseQueue: mqQueues.CHAT_QUEUE,
        data: broadcast,
      }),
    ),
  );
}

module.exports = { sendMsgToBot, syncBroadcastToManagementService };
