const {
  Types: { ObjectId },
} = require('mongoose');
const {
  websocket: { types, messageTypes, messageStatus },
  sources,
  fbSenderActions,
  responseActionTypes,
} = require('../../configs');
const { ACTION_CARD_TYPE } = require('../../constants');
const { client: redisClient, publisher } = require('../../utils/redis');
const messageService = require('../message');
const zaloService = require('../zalo');
const facebookService = require('../facebook');
const viberService = require('../viber');
const telegramService = require('../telegram');
const appService = require('../app');
const sessionService = require('../session');
const { sleep } = require('../../utils/delay');
const { faceMask } = require('../../utils/faceMask');
const subscriberService = require('../subscriber');
const User = require('../../models/user');
const App = require('../../models/app');
const { replyModes, appRoles } = require('../../configs');
const { sendNotification } = require('../firebase');
const { transformMessage } = require('../websocket/transformMsg');

const { LIVECHAT_CHANNEL } = process.env;

const predictParams = {
  firstIntent: '{y_dinh_1}',
  secondIntent: '{y_dinh_2}',
  thirdIntent: '{y_dinh_3}',
  firstUserSay: '{mau_cau_1}',
  secondUserSay: '{mau_cau_2}',
  thirdUserSay: '{mau_cau_3}',
};

function isPromptTemplate(promptDescription) {
  if (!promptDescription) return false;

  for (const param of Object.values(predictParams)) {
    if (promptDescription.match(param)) return true;
  }

  return false;
}

function fillTemplate(promptDescription, intents, userSays) {
  const [firstIntent, secondIntent, thirdIntent] = intents;
  const [firstUserSay, secondUserSay, thirdUserSay] = userSays;
  return promptDescription
    .replace(new RegExp(predictParams.firstIntent, 'gi'), firstIntent)
    .replace(new RegExp(predictParams.secondIntent, 'gi'), secondIntent)
    .replace(new RegExp(predictParams.thirdIntent, 'gi'), thirdIntent)
    .replace(new RegExp(predictParams.firstUserSay, 'gi'), firstUserSay)
    .replace(new RegExp(predictParams.secondUserSay, 'gi'), secondUserSay)
    .replace(new RegExp(predictParams.thirdUserSay, 'gi'), thirdUserSay);
}

function getMessageFromResult(result) {
  const { attachment, isFaceMask } = result;
  let { text } = result;
  text = isFaceMask ? faceMask(text) : text;

  if (attachment) {
    const {
      type,
      url,
      option,
      content,
      csrs,
      urlCache,
      endCode,
      promptDescription,
    } = attachment;
    switch (type) {
      case ACTION_CARD_TYPE.IMAGE:
        return {
          text,
          attachment: {
            type: messageTypes.IMAGE,
            payload: {
              url,
            },
          },
        };
      case ACTION_CARD_TYPE.AUDIO:
        return {
          text,
          attachment: {
            type: messageTypes.AUDIO,
            payload: {
              url,
            },
          },
        };
      case ACTION_CARD_TYPE.VIDEO:
        return {
          text,
          attachment: {
            type: messageTypes.VIDEO,
            payload: {
              url,
            },
          },
        };
      case ACTION_CARD_TYPE.CATEGORY: {
        const intents = option.map((i) => i.intentDisplayName);
        const userSays = option.map((i) => i.value);
        return {
          text: isPromptTemplate(promptDescription)
            ? fillTemplate(promptDescription, intents, userSays)
            : text,
          attachment: {
            type: messageTypes.OPTION,
            payload: {
              content: isPromptTemplate(promptDescription)
                ? fillTemplate(promptDescription, intents, userSays)
                : text,
              elements: isFaceMask
                ? option.map((op) => ({
                    ...op,
                    label: faceMask(op.label),
                  }))
                : option,
            },
          },
        };
      }
      case ACTION_CARD_TYPE.PERSONALIZED_TEXT:
        return {
          attachment: {
            type: messageTypes.PERSONALIZE_TEXT,
            payload: {
              content: transformMessage(content),
              urlCache,
            },
          },
        };
      case ACTION_CARD_TYPE.RECORD:
        return {
          attachment: {
            type: messageTypes.RECORD,
            payload: {
              url,
            },
          },
        };
      case ACTION_CARD_TYPE.CONNECT_CSR:
        return {
          attachment: {
            type: messageTypes.CSR,
            payload: {
              csrs: csrs || [],
            },
          },
        };
      case ACTION_CARD_TYPE.END_CALL: {
        return {
          attachment: {
            type: messageTypes.END_CALL,
            payload: {
              endCode,
            },
          },
        };
      }
      case ACTION_CARD_TYPE.FORWARD_TO_AGENT:
        return {
          attachment: {
            type: messageTypes.FORWARD_TO_AGENT,
          },
        };
      default:
        return { text };
    }
  } else {
    return { text };
  }
}

async function handleResponse(data, isAgentChat = false) {
  const { sessionId } = data;
  data.isAgentChat = isAgentChat;

  await redisClient.lpushAsync(
    `LIVECHAT_RESPONSE_${sessionId}`,
    JSON.stringify(data),
  );
  await runResponseQueue(sessionId);
}

async function runResponseQueue(sessionId) {
  const status = await redisClient.incrAsync(
    `LIVECHAT_RESPONSE_STATUS_${sessionId}`,
  );
  console.log(`LIVECHAT_RESPONSE_STATUS_${sessionId} status`, status);
  if (status > 1) {
    console.log(`Queue LIVECHAT_RESPONSE_STATUS_${sessionId} is running`);
    return;
  }

  const numberOfResponses = await redisClient.llenAsync(
    `LIVECHAT_RESPONSE_${sessionId}`,
  );
  console.log(
    `LIVECHAT_RESPONSE_STATUS_${sessionId} numberOfResponses`,
    numberOfResponses,
  );
  if (numberOfResponses === 0) {
    console.log(`LIVECHAT_RESPONSE_STATUS_${sessionId} is empty`);
    await redisClient.delAsync(`LIVECHAT_RESPONSE_STATUS_${sessionId}`);
    return;
  }

  try {
    let data = await redisClient.rpopAsync(`LIVECHAT_RESPONSE_${sessionId}`);
    data = JSON.parse(data);

    const {
      type,
      error,
      result,
      userId,
      platform,
      appId,
      agentId,
      actionArr,
      isDev,
      isAgentChat,
      attachment,
      parameters = [],
    } = data;

    const params = parameters.reduce(
      (prev, { entity, displayName, text }) => ({
        ...prev,
        [entity]: { name: displayName, value: text },
      }),
      {},
    );
    await sessionService.updateParameters(sessionId, params);

    if (!error && type === responseActionTypes.ARRAY_ACTION) {
      const messages = [];
      for (const act of actionArr) {
        const {
          responseText: text,
          attachment: atch,
          faceMask: isFaceMask,
        } = act;
        const app = await appService.findOne({ _id: appId });
        const { botToken } = app;
        const message = await messageService.saveMessage({
          content: getMessageFromResult({ text, attachment: atch, isFaceMask }),
          sessionId,
          appId,
          sender: { bot: botToken },
          receiver: { user: userId },
          createdAt: new Date(),
          platform,
          action: act.action,
          status: messageStatus.SENDING,
        });
        messages.push(message);
      }

      data.messages = messages;

      const endCodes = actionArr.reduce((prev, { attachment: atch }) => {
        if (atch && atch.type === ACTION_CARD_TYPE.END_CALL)
          return [...prev, atch.endCode];
        return prev;
      }, []);
      if (endCodes.length)
        await sessionService.updateMetadata(sessionId, { endCodes });
    }

    if (!error && type !== responseActionTypes.ARRAY_ACTION) {
      let message = isAgentChat
        ? result
        : getMessageFromResult({ ...result, isFaceMask: result.faceMask });

      // BIDV
      if (message.text === 'SUBSCRIBE') {
        await subscriberService.subscribe(userId, platform, appId);
        return;
      }

      if (message.text === 'UNSUBSCRIBE') {
        await subscriberService.unsubscribe(userId, appId);
        return;
      }

      if (!isDev) {
        if (isAgentChat) {
          const { msgId } = message;
          delete message.msgId;
          message = await messageService.saveMessage({
            content: message,
            sessionId,
            appId,
            sender: { agent: agentId },
            receiver: { user: userId },
            createdAt: new Date(),
            platform,
            status: messageStatus.SENDING,
          });
          message = message.toObject();
          message.clientMsgId = msgId;
        } else {
          const app = await appService.findOne({ _id: appId });
          const { botToken } = app;
          message = await messageService.saveMessage({
            content: message,
            sessionId,
            appId,
            sender: { bot: botToken },
            receiver: { user: userId },
            createdAt: new Date(),
            platform,
            status: messageStatus.SENDING,
          });
        }
      }
      data.message = message;

      if (attachment && attachment.type === ACTION_CARD_TYPE.END_CALL) {
        const endCodes = [attachment.endCode];
        await sessionService.updateMetadata(sessionId, { endCodes });
      }
    }

    const isForwardToAgent =
      userId &&
      ObjectId.isValid(userId) &&
      result &&
      result.attachment &&
      result.attachment.type === ACTION_CARD_TYPE.FORWARD_TO_AGENT;
    if (isForwardToAgent) {
      data.forwardAgent = true;
      const userSendMessage = await User.findByIdAndUpdate(
        userId,
        { replyMode: replyModes.AGENT },
        { new: true },
      );

      if (appId) {
        const app = await App.findOne({ _id: appId })
          .populate({ path: 'roles.account', select: 'firebaseToken' })
          .select('roles');

        const firebaseTokens = app.roles
          .filter(
            (agent) =>
              agent.role === appRoles.AGENT && agent.account.firebaseToken,
          )
          .map((agent) => agent.account.firebaseToken);

        await Promise.all(
          firebaseTokens.map(async (firebaseToken) => {
            await sendNotification({
              userToken: firebaseToken,
              notificationTitle: 'New message',
              notificationBody: userSendMessage.profile.fullName,
              clickAction: `${process.env.DASHBOARD_DOMAIN}/apps/${appId}/live-support`,
            });
          }),
        );
      }
    }

    const { messageInfo, forwardAgent } = data;

    if (!forwardAgent && platform === sources.FACEBOOK) {
      await facebookService.handleSendActionToFacebook({
        ...data.facebook,
        senderAction: fbSenderActions.TYPING_ON,
      });
    }

    if (type !== responseActionTypes.ARRAY_ACTION) {
      const [minDelay, maxDelay] = [800, 1500];
      const randomDelay = Math.floor(
        Math.random() * (maxDelay - minDelay + 1) + minDelay,
      );
      await sleep(randomDelay);
    }

    if (messageInfo) {
      // update message status SEEN if bot reply
      await messageService.updateMessage(messageInfo.msgId, {
        status: messageStatus.SEEN,
      });
    }

    switch (platform) {
      case sources.WEB: {
        const { message } = data;
        publisher.publish(
          LIVECHAT_CHANNEL,
          JSON.stringify({ type: types.CHAT, data }),
        );
        if (messageInfo) {
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({
              type: types.MSG_STATUS,
              data: {
                userId,
                msgId: messageInfo.clientMsgId,
                status: messageStatus.SEEN,
              },
            }),
          );
        } else if (message.clientMsgId) {
          const { clientMsgId, _id: msgId, app, sender } = message;
          // update message status SENT to agent
          await messageService.updateMessage(msgId, {
            status: messageStatus.SENT,
          });
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({
              type: types.MSG_STATUS,
              data: {
                appId: app,
                agentId: sender.agent._id,
                msgId: clientMsgId,
                status: messageStatus.SENT,
              },
            }),
          );
        }
        break;
      }
      case sources.ZALO:
        delete data.result;
        if (!error) {
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({ type: types.CHAT, data }),
          );
          await zaloService.handleResponseToZalo(data);
        }
        break;
      case sources.FACEBOOK:
        delete data.result;
        if (!error) {
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({ type: types.CHAT, data }),
          );
          await facebookService.handleResponseToFacebook(data);
        } else
          await facebookService.handleSendActionToFacebook({
            ...data.facebook,
            senderAction: fbSenderActions.TYPING_OFF,
          });
        break;
      case sources.VIBER:
        delete data.result;
        if (!error) {
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({ type: types.CHAT, data }),
          );
          await viberService.handleResponseToViber(data);
        }
        break;
      case sources.TELEGRAM:
        delete data.result;
        if (!error) {
          publisher.publish(
            LIVECHAT_CHANNEL,
            JSON.stringify({ type: types.CHAT, data }),
          );
          console.log(
            'handle_response_to_telegram',
            JSON.stringify(data, null, 4),
          );
          await telegramService.handleResponseToTelegram(data);
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }

  await redisClient.delAsync(`LIVECHAT_RESPONSE_STATUS_${sessionId}`);
  await runResponseQueue(sessionId);
}

module.exports = { handleResponse, runResponseQueue };
