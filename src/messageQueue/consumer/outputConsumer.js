/* eslint-disable no-console */
const chatbotService = require('../../services/chatbot');
const {
  mqQueues: { OUTPUT_QUEUE },
} = require('../../configs');

module.exports = (channel) => {
  channel.assertQueue(OUTPUT_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(OUTPUT_QUEUE, (message) => {
    channel.ack(message);
    const content = JSON.parse(message.content.toString('utf8'));
    console.log(content);
    // global.PRODUCER.sendToQueue(
    //   content.resultQueue,
    //   Buffer.from(
    //     JSON.stringify({
    //       ...content,
    //       error: 0, // 1 nếu có lỗi
    //       message: 'Processing failed. Please try again', // trả về khi error = 1
    //       result: {
    //         text: 'Bạn muốn đi xe giường nằm hay ghế ngồi',
    //         attachment: {
    //           type: 'OPTION',
    //           payload: {
    //             elements: [
    //               { label: 'Giường nằm', value: 'giường nằm' },
    //               { label: 'Ghế ngồi', value: 'ghế ngồi' },
    //             ],
    //           },
    //           // các loại attachment type khác
    //           // type: 'IMAGE, VIDEO, AUDIO, FILE',
    //           // payload: {
    //           //   url: 'https://dev-cdn.iristech.club/abc.png',
    //           // },
    //         },
    //       },
    //     }),
    //   ),
    // );
    try {
      console.time();
      chatbotService.handleMessage(content);
      console.timeEnd();
      // require('../responseHandler').handleResponse(response);
      // channel.sendToQueue(resultQueue, Buffer.from(JSON.stringify(response)));
    } catch (error) {
      console.log(error);
    }
  });
};
