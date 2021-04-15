// /* eslint-disable no-console */
// const redis = require('redis');
// const bluebird = require('bluebird');
// require('dotenv').config();

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

// const client = redis.createClient({
//   port: process.env.REDIS_PORT || 6379,
//   host: process.env.REDIS_HOST,
//   // password: process.env.REDIS_PASSWORD,
// });

// client.on('error', (err) => {
//   console.error('REDIS_ERROR: ', err);
// });

// const publisher = redis.createClient({
//   port: process.env.REDIS_PORT || 6379,
//   host: process.env.REDIS_HOST,
//   // password: process.env.REDIS_PASSWORD,
// });

// const subscriber = redis.createClient({
//   port: process.env.REDIS_PORT || 6379,
//   host: process.env.REDIS_HOST,
//   // password: process.env.REDIS_PASSWORD,
// });

// module.exports = { client, publisher, subscriber };
