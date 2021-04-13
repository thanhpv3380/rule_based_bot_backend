/* eslint-disable no-console */
const amqp = require('amqplib/callback_api');
const consumer = require('./consumer');
const producer = require('./producer');
const { MQ_URI } = require('../configs');

amqp.connect(MQ_URI, (error, connection) => {
  if (error) {
    console.error('[RabbitMQ ERROR]', error);
    throw error;
  }

  console.log(`Connected to RabbitMQ ${MQ_URI}`);

  consumer(connection);
  producer(connection);
});
