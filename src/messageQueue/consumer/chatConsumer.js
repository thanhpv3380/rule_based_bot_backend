const {
  mqTypes,
  mqQueues: { CHAT_QUEUE },
} = require('../../../configs');

module.exports = (channel) => {
  channel.assertQueue(CHAT_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(CHAT_QUEUE, async (message) => {
    channel.ack(message);
    const content = JSON.parse(message.content.toString('utf8'));
    console.log(CHAT_QUEUE, content);

    const { type, responseQueue, data } = content;
    switch (type) {
      case mqTypes.CREATE_APP: {
        const { _id, ...appInfo } = data;
        await appService.createApp(_id, appInfo);
        // const agentIds = appInfo.roles.map((role) => role.account);
        // await updateAgentConnection(_id, agentIds);
        break;
      }
      case mqTypes.DELETE_APP: {
        const { _id } = data;
        await appService.deleteApp(_id);
        break;
      }
      default:
        break;
    }
  });
};
