const appService = require('../../app');
const agentService = require('../../agent');
const botService = require('../../bot');
const broadcastService = require('../../broadcast');
const {
  mqTypes,
  mqQueues: { CHAT_QUEUE },
} = require('../../../configs');
const { updateAgentConnection } = require('../../websocket/saveConnection');

module.exports = channel => {
  channel.assertQueue(CHAT_QUEUE, { durable: false });
  channel.prefetch(1);

  channel.consume(CHAT_QUEUE, async message => {
    channel.ack(message);
    const content = JSON.parse(message.content.toString('utf8'));
    console.log(CHAT_QUEUE, content);

    const { type, responseQueue, data } = content;
    switch (type) {
      case mqTypes.CREATE_APP: {
        const { _id, ...appInfo } = data;
        await appService.createApp(_id, appInfo);
        const agentIds = appInfo.roles.map(role => role.account);
        await updateAgentConnection(_id, agentIds);
        break;
      }
      case mqTypes.DELETE_APP: {
        const { _id } = data;
        await appService.deleteApp(_id);
        break;
      }
      case mqTypes.BROADCAST: {
        const {
          app: appId,
          _id: broadcastId,
          messages,
          recipients,
          schedules,
        } = data;
        await broadcastService.handleBroadcastMessage({
          appId,
          broadcastId,
          messages,
          recipients,
          schedules,
        });
        break;
      }
      case mqTypes.STOP_BROADCAST: {
        const { broadcastId, appId } = data;
        await broadcastService.stopCampaign({
          broadcastId,
          appId,
        });
        break;
      }
      case mqTypes.CREATE_AGENT:
      case mqTypes.UPDATE_AGENT: {
        const { _id, ...agentInfo } = data;
        await agentService.createAgent(_id, agentInfo);
        break;
      }
      case mqTypes.DELETE_AGENT: {
        const { _id } = data;
        await agentService.deleteAgent(_id);
        break;
      }
      case mqTypes.CREATE_BOT:
      case mqTypes.UPDATE_BOT: {
        const { _id, ...botInfo } = data;
        await botService.createBot(_id, botInfo);
        break;
      }
      case mqTypes.DELETE_BOT: {
        const { _id } = data;
        await botService.deleteBot(_id);
        break;
      }
      case mqTypes.UPDATE_BOT_NAME: {
        const { botId, botName } = data;
        await appService.updateBotName({ botId, botName });
        break;
      }
      default:
        break;
    }
  });
};
