/* eslint-disable no-console */
const cstruct = require('python-struct');
const camelCase = require('camelcase-keys');
const {
  mqQueues: { OUTPUT_QUEUE },
} = require('../../../configs');

module.exports = (channel) => {
  channel.assertQueue(OUTPUT_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(OUTPUT_QUEUE, (message) => {
    channel.ack(message);

    try {
      const { content } = message;
      const [jsonLength, byteLength] = cstruct.unpack(
        '>ii',
        content.slice(0, 8),
      );

      if (byteLength === 0) {
        let response = JSON.parse(
          content.slice(8, jsonLength + 8).toString('utf8'),
        );
        response = camelCase(response, { deep: true });

        console.log('Response from bot', JSON.stringify(response));
        const { error, message: errorMessage } = response;
        if (error && errorMessage) {
          delete response.message;
          response.errorMessage = errorMessage;
        }
        require('../responseHandler').handleResponse(response);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
