const {
  PORT,

  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  // ELASTICSEARCH_PORT,
  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME,
  RABBITMQ_HOST,
  // RABBITMQ_PORT,
  // RABBITMQ_USERNAME,
  // RABBITMQ_PASSWORD,
} = process.env;

const { A_WEEK } = require('../constants');

const mqQueues = {
  RECEIVE_QUEUE: '',
  SEND_QUEUE: '',
  OUTPUT_QUEUE: 'rule_bot',
  LOG_MESSAGE_QUEUE: 'log_message',
};

module.exports = {
  PORT: PORT || 3000,
  MONGO_URI_LOCAL: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`,
  MONGO_URI_CLOUD: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`,
  JWT_SECRET_KEY,
  JWT_EXPIRES_TIME: parseInt(JWT_EXPIRES_TIME, 10) || A_WEEK,
  mqQueues,
  // MQ_URI: `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`,
  MQ_URI: `amqp://${RABBITMQ_HOST}`,
};
