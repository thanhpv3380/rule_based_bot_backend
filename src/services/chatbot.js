/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
const axios = require('axios');
const camelcaseKeys = require('camelcase-keys');
const { client } = require('../utils/redis');
// const CustomError = require('../errors/CustomError');
// const errorCodes = require('../errors/code');
const intentES = require('../elasticsearch/intent');
const nodeDao = require('../daos/node');
const conditionService = require('./condition');
const actionDao = require('../daos/action');
const intentDao = require('../daos/intent');
const groupActionDao = require('../daos/groupAction');
const botDao = require('../daos/bot');
const {
  NODE_INTENT,
  NODE_ACTION,
  NODE_CONDITION,
  EQUAL,
  GREATER,
  LESS_THAN,
  DIFFERENT,
  START_WITH,
  OPERATOR_AND,
  ACTION_TEXT,
  ACTION_MEDIA,
  ACTION_JSON_API,
  ACTION_OPTION,
  STATUS_DEFAULT,
  STATUS_ANSWERED,
  // STATUS_SILENCE,
  STATUS_NOT_UNDERSTAND,
  STATUS_NEED_CONFIRM,
  DEFAULT_REPLY,
} = require('../constants');
const {
  mqQueues: { LOG_MESSAGE_QUEUE },
} = require('../configs');

let actionResponse = [];
let parametersRequire = [];
let parameters = [];
let message;
let bot;
let content = null;

const resetValue = async () => {
  actionResponse = [];
  parametersRequire = [];
  parameters = [];
  message = null;
  bot = null;
  content = null;
};

const handleMessage = async (contentReceive) => {
  content = contentReceive;
  const {
    sessionId,
    message: { text },
  } = contentReceive;
  const botCurrent = await botDao.findBot({ botToken: content.accessToken });
  await getAction(sessionId, text, botCurrent._id);
};

const getAction = async (sessionId, usersay, botId) => {
  // await client.delAsync(sessionId);
  bot = botId;
  message = { text: usersay };
  let data = await client.getAsync(sessionId);
  // check session existed
  if (data) {
    data = JSON.parse(data);
    parameters = data.parameters;
    if (data.isMappingOneOne) {
      const response = await handleCheckRequireParamsAgain(
        sessionId,
        data,
        usersay,
      );
      await resetValue();
      return response;
    }
    return handleUserSayInWorkflow(sessionId, usersay, data, botId);
  }
  // if not in session
  const response = await handleUsersaySend(sessionId, usersay, botId);
  return response;
};

const handleUsersaySend = async (sessionId, usersay, botId) => {
  let hits = null;
  try {
    const data = await intentES.findIntent(usersay, botId);
    hits = data.hits;
  } catch (err) {
    console.log(err);
    hits = null;
  }
  if (!hits || hits.hits.length === 0) {
    const groupActionSystem = await groupActionDao.findGroupSystemActionAndItem(
      bot,
    );
    let response = [];
    if (groupActionSystem && groupActionSystem.children) {
      response = handleResponse(groupActionSystem.children);
    } else {
      response = [
        {
          message: {
            text: DEFAULT_REPLY,
          },
        },
      ];
    }

    await sendToQueue(response, sessionId, null, STATUS_NOT_UNDERSTAND);
    await client.delAsync(sessionId);
    return response;
  }
  const result = hits.hits.find((el) => el._score === hits.max_score);

  // find intent is start workflow
  const workflows = await nodeDao.findNodeIntentStartFlow(botId, result._id);

  let intent = {};
  let workflow = null;
  if (workflows.length !== 0) {
    workflow = workflows[Math.floor(Math.random() * (workflows.length - 1))];
    if (workflow.intent) {
      intent = workflow.intent;
    } else {
      intent = await findIntentById(result._id);
    }
  } else {
    intent = await findIntentById(result._id);
  }

  // Check require parameter of intent
  const response = await requireParamsIntent(
    workflow,
    intent,
    usersay,
    sessionId,
  );

  if (response) {
    return response;
  }

  if (workflow && workflow.children.length !== 0) {
    await checkChildNode(sessionId, workflow);
    const responses = [...actionResponse];
    await resetValue();
    return responses;
  }
  return handleMappingOneOne(intent, sessionId);
};

const handleUserSayInWorkflow = async (sessionId, usersay, data, botId) => {
  const currentNode = await nodeDao.findNodeById(data.currentNodeId);
  if (!currentNode) {
    // eslint-disable-next-line no-console
    console.log('currentNode not existed in redis');
    return null;
  }
  const workflowId = currentNode.workflow;
  const listIntentId = currentNode.children.map((el) =>
    el.node.intent.toString(),
  );
  let hits = null;
  try {
    const resultES = await intentES.findIntentByCondition(
      usersay,
      botId,
      listIntentId,
    );
    hits = resultES.hits;
  } catch (err) {
    hits = null;
  }
  // todo status response
  if (hits.hits.length === 0) {
    let response = [];
    if (
      currentNode.actionAskAgain &&
      currentNode.actionAskAgain.actionAskAgain
    ) {
      if (data.numberOfLoop) {
        if (data.numberOfLoop < currentNode.actionAskAgain.numberOfLoop) {
          const newData = {
            ...data,
            numberOfLoop: data.numberOfLoop + 1,
          };
          await client.setexAsync(sessionId, 3600, JSON.stringify(newData));
          response = await handleResponse(
            currentNode.actionAskAgain.actionAskAgain,
          );
          await client.delAsync(sessionId);
        } else {
          await client.delAsync(sessionId);
          response = await handleResponse(
            currentNode.actionAskAgain.actionFail,
          );
        }
      } else if (currentNode.actionAskAgain.numberOfLoop > 0) {
        const newData = {
          ...data,
          numberOfLoop: 0,
        };
        await client.setexAsync(sessionId, 3600, JSON.stringify(newData));
        response = await handleResponse(
          currentNode.actionAskAgain.actionAskAgain,
        );
      } else {
        await client.delAsync(sessionId);
        response = await handleResponse(currentNode.actionAskAgain.actionFail);
      }
    } else {
      const groupActionSystem = await groupActionDao.findGroupSystemActionAndItem(
        bot,
      );
      if (groupActionSystem && groupActionSystem.children) {
        response = handleResponse(groupActionSystem.children);
      } else {
        response = [
          {
            message: {
              text: DEFAULT_REPLY,
            },
          },
        ];
      }

      await client.delAsync(sessionId);
    }
    await sendToQueue(response, sessionId, workflowId, STATUS_NOT_UNDERSTAND);
    return response;
  }
  const result = hits.hits.find((el) => el._score === hits.max_score);

  const childNode = currentNode.children.find(
    (el) => el.node.intent.toString() === result._id,
  );

  const intentNode = await nodeDao.findNodeById(childNode.node._id);

  const response = await requireParamsIntent(
    intentNode,
    intentNode.intent,
    usersay,
    sessionId,
  );
  if (response) {
    return response;
  }
  if (intentNode.children.length !== 0) {
    await checkChildNode(sessionId, intentNode);
    const responses = [...actionResponse];
    await resetValue();
    return responses;
  }
  return handleMappingOneOne(intentNode.intent, sessionId, workflowId);
};

const requireParamsIntent = async (currentNode, intent, usersay, sessionId) => {
  const workflowId = currentNode && currentNode.workflow;
  for (let index = 0; index < intent.parameters.length; index++) {
    const el = JSON.parse(JSON.stringify(intent.parameters[index]));
    const parameter = getParameter(el.entity, usersay);
    if (!parameter && el.required) {
      parametersRequire.push(el);
    } else {
      // nếu parameter tìm thấy
      el.value = parameter;
      parameters.push(el);
    }
  }
  if (parametersRequire.length !== 0) {
    const data = {
      currentNodeId:
        currentNode && currentNode.children.length !== 0 && currentNode._id,
      parametersRequire,
      intentId: intent._id,
      parameters,
      numberOfLoop: 0,
      isMappingOneOne: true,
    };
    await client.setexAsync(sessionId, 3600, JSON.stringify(data));
    const response = await handleResponse(
      parametersRequire[0].response.actionAskAgain,
      [parametersRequire[0]],
    );
    await sendToQueue(response, sessionId, workflowId, STATUS_NEED_CONFIRM);
    return actionResponse.concat(response);
  }
  return null;
};

const checkChildNode = async (sessionId, currentNode) => {
  if (!currentNode || currentNode.children.length === 0) {
    await client.delAsync(sessionId);
    return;
  }
  let type = null;
  currentNode.children.sort(comparePosition);
  for (const el of currentNode.children) {
    switch (el.type) {
      case NODE_INTENT:
        const data = {
          currentNodeId: currentNode._id,
          parameters,
          isMappingOneOne: false,
        };
        await client.setexAsync(sessionId, 3600, JSON.stringify(data));
        return;
      case NODE_CONDITION:
        type = NODE_CONDITION;
        const check = await handleCondition(el);
        if (check) {
          const currentChildNode = await nodeDao.findNodeById(el.node._id);
          await checkChildNode(sessionId, currentChildNode);
          return;
        }
        break;
      case NODE_ACTION:
        const action = await actionDao.findActionByCondition({
          _id: el.node.action,
        });
        if (action) {
          const response = await handleResponse(action);
          await sendToQueue(
            response,
            sessionId,
            currentNode.workflow,
            STATUS_ANSWERED,
          );
          actionResponse = actionResponse.concat(response);
          const currentChildNode = await nodeDao.findNodeById(el.node._id);
          await checkChildNode(sessionId, currentChildNode);
        }
        return;
      default:
        break;
    }
  }
  if (type === NODE_CONDITION) {
    const groupActionSystem = await groupActionDao.findGroupSystemActionAndItem(
      bot,
    );
    let response = [];
    if (groupActionSystem && groupActionSystem.children) {
      response = handleResponse(groupActionSystem.children);
    } else {
      response = [
        {
          message: {
            text: DEFAULT_REPLY,
          },
        },
      ];
    }

    actionResponse = actionResponse.concat(response);
    await sendToQueue(
      response,
      sessionId,
      currentNode.workflow,
      STATUS_DEFAULT,
    );
    await client.delAsync(sessionId);
  }
};

const comparePosition = (x1, x2) => {
  return x1.node.position.x - x2.node.position.x;
};

const handleCondition = async (child) => {
  let condition = null;
  try {
    condition = await conditionService.findById(child.node.condition);
  } catch (err) {
    condition = null;
  }

  const results = [];
  if (!condition) {
    return false;
  }
  for (const el of condition.conditions) {
    const valueParameter = parameters.find(
      (p) => p.parameterName === el.parameter.name,
    ).value;
    let check;
    switch (el.operator) {
      case EQUAL:
        check = valueParameter === el.value;
        break;
      case GREATER:
        check = valueParameter > el.value;
        break;
      case LESS_THAN:
        check = valueParameter < el.value;
        break;
      case DIFFERENT:
        check = valueParameter !== el.value;
        break;
      case START_WITH:
        check = valueParameter.startsWith(el.value);
        break;
      default:
        break;
    }
    results.push(check);
  }
  if (OPERATOR_AND === condition.operator) {
    return !results.includes(false);
  }
  return results.includes(true);
};

const handleMappingOneOne = async (intent, sessionId, workflowId) => {
  const { mappingAction } = intent;
  let response = [];
  if (mappingAction) {
    response = await handleResponse(mappingAction);
  }
  // todo default reply mapping one one
  await sendToQueue(response, sessionId, workflowId, STATUS_DEFAULT);
  await client.delAsync(sessionId);
  return response;
};

const handleCheckRequireParamsAgain = async (sessionId, data, usersay) => {
  const intent = await findIntentById(data.intentId);
  const currentParameter = await { ...data.parametersRequire[0] };
  const param = getParameter(currentParameter.entity, usersay);
  const newParameterRequire = [...data.parametersRequire];
  if (!param) {
    let response = [];
    let status = null;
    // nếu parameter vẫn không tìm thấy
    if (data.numberOfLoop >= currentParameter.response.numberOfLoop) {
      // nếu quá số vòng lặp
      response = await handleResponse(
        currentParameter.response.actionBreak,
        [],
      );
      status = STATUS_NOT_UNDERSTAND;
      await client.delAsync(sessionId);
    } else {
      // nếu không quá số vòng lặp
      response = await handleResponse(currentParameter.response.actionAskAgain);
      status = STATUS_NEED_CONFIRM;
      data.numberOfLoop += 1;
      await client.setexAsync(sessionId.toString(), 3600, JSON.stringify(data));
    }
    await sendToQueue(response, sessionId, data.workflow, status);
    return response;
  }

  // nếu tìm thấy parameter trong lần hỏi tiếp theo
  currentParameter.value = param;
  data.parameters.push(currentParameter);
  newParameterRequire.splice(0, 1);
  const listIndex = [];
  // vòng lặp kiểm tra các parameter sau đó
  for (let i = 0; i < newParameterRequire.length; i++) {
    const element = newParameterRequire[i];
    const newParameter = getParameter(element.entity, usersay);
    if (!newParameter && element.required) {
      // nếu parameter sau đó không tìm thấy
      const newData = {
        ...data,
        parametersRequire:
          listIndex.length === 0
            ? newParameterRequire.filter(
                (el, index) =>
                  listIndex.findIndex((item) => item === index) < 0,
              )
            : newParameterRequire,
        parameters: data.parameters,
        numberOfLoop: 0,
        isMappingOneOne: true,
      };
      await client.setexAsync(sessionId, 3600, JSON.stringify(newData));
      const response = await handleResponse(element.response.actionAskAgain, [
        element,
      ]);
      // xoá cache của parameter trước đó
      return response;
    }
    listIndex.push(i);
    // nếu parameter sau đó tìm thấy
    element.value = newParameter;
    parameters.push(element);
  }
  data.isMappingOneOne = false;

  if (!data.currentNodeId) {
    // end workflow or intent
    await client.delAsync(sessionId);
    return handleMappingOneOne(intent, sessionId);
  }
  const currentNode = await nodeDao.findNodeById(data.currentNodeId);
  await client.setexAsync(sessionId, 3600, JSON.stringify(data));
  await checkChildNode(sessionId, currentNode);

  const responses = [...actionResponse];
  actionResponse = [];
  parameters = [];

  return responses;
};

const getParameter = (entity, usersay) => {
  let param = null;
  switch (entity.type) {
    case 1:
      param = entity.synonyms.find(
        (el) => el.input.findIndex((item) => usersay.indexOf(item) >= 0) >= 0,
      );
      return (param && param.output) || null;
    case 2:
      param = usersay.match(new RegExp(entity.pattern));
      return (param && param[0]) || param;
    default:
      return null;
  }
};

// no use for actionAskAgain
const handleResponse = async (action) => {
  const responses = [];
  if (!action) {
    return responses;
  }

  for (const item of action.actions) {
    switch (item.typeAction) {
      case ACTION_TEXT:
        // eslint-disable-next-line no-loop-func
        const text = item.text.map((el) => {
          return repaceValueParameter(el);
        });
        responses.push({
          message: {
            text: text[Math.floor(Math.random() * (text.length - 1))],
          },
        });
        break;
      case ACTION_MEDIA:
        responses.push({
          message: {
            text: repaceValueParameter(item.media.description),
            attachment: {
              type: item.media.typeMedia,
              payload: {
                url: item.media.url,
              },
            },
          },
        });
        break;
      case ACTION_JSON_API:
        const { method, url } = item.api;
        // eslint-disable-next-line no-unused-vars
        const headerObj = {};
        const body = {};
        item.api.headers.forEach((el) => {
          headerObj[el.title] = el.value;
        });
        item.api.body.forEach((el) => {
          body[el.title] = el.value;
        });
        const data = await axios({
          method,
          url,
          headers: headerObj,
          body,
        });
        const parameter = item.api.parameters.map((el) => {
          const values = el.value.split('.');
          // _.mapKeys(values, (v, k) => _.camelCase(k));
          let value = { ...data.data };

          for (const ele of values) {
            value = camelcaseKeys(value, { deep: false });
            const indexStart = ele.indexOf('[');
            if (indexStart >= 0) {
              const indexEnd = ele.indexOf(']');
              const value1 = ele.slice(0, indexStart);
              // eslint-disable-next-line radix
              const value2 = parseInt(ele.slice(indexStart + 1, indexEnd));
              value = value[value1][value2];
            } else {
              value = value[ele];
            }
          }
          return {
            value,
            parameter: el.name,
          };
        });
        parameters = parameters.concat(parameter);

        break;
      case ACTION_OPTION:
        responses.push({
          message: {
            text: repaceValueParameter(item.options.description || 'text'),
            attachment: {
              type: ACTION_OPTION,
              payload: {
                elements:
                  (item.options.optionsChild &&
                    item.options.optionsChild.map((el) => {
                      return {
                        label: el.name,
                        value: el.value,
                      };
                    })) ||
                  [],
              },
            },
          },
        });
        break;
      default:
        responses.push({
          message: {
            text: (item.gallery[0] && item.gallery[0].description) || 'text',
            attachment: item.gallery.map((el) => {
              return {
                type: 'image',
                payload: {
                  url: el.url,
                },
              };
            }),
          },
        });
        break;
    }
  }

  return responses;
};

const repaceValueParameter = (text) => {
  for (let index = 0; index < parameters.length; index++) {
    const element = parameters[index];
    const replace = `{${element.parameterName}}`;
    text = text.replace(replace, element.value);
  }
  return text;
};

const findIntentById = async (id) => {
  const intent = await intentDao.findIntentByCondition({
    condition: { _id: id },
    populate: [
      {
        path: 'mappingAction',
        model: 'Action',
      },
      {
        path: 'parameters',
        populate: [
          {
            path: 'entity',
          },
          {
            path: 'response.actionAskAgain',
            model: 'Action',
          },
          {
            path: 'response.actionBreak',
            model: 'Action',
          },
        ],
      },
    ],
  });
  return intent;
};

const sendToQueue = async (data, sessionId, workflowId, status) => {
  const { PRODUCER } = global;
  // message of user
  await PRODUCER.sendToQueue(
    LOG_MESSAGE_QUEUE,
    Buffer.from(
      JSON.stringify({
        sessionId,
        message,
        from: 'USER',
        botId: bot,
        workflowId,
        status,
      }),
    ),
  );

  for (const el of data) {
    console.log(el.message);
    if (content) {
      // send chat with user
      await PRODUCER.sendToQueue(
        content.resultQueue,
        Buffer.from(
          JSON.stringify({
            ...content,
            message: 'success',
            error: 0,
            result: el.message,
          }),
        ),
      );
    }
    // send log message
    await PRODUCER.sendToQueue(
      LOG_MESSAGE_QUEUE,
      Buffer.from(
        JSON.stringify({
          sessionId,
          message: el.message,
          from: 'BOT',
          bot,
          workflowId,
        }),
      ),
    );
  }
};

module.exports = {
  handleCheckRequireParamsAgain,
  handleUsersaySend,
  getAction,
  handleMessage,
};
