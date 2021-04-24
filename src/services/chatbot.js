/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
const axios = require('axios');
const { client } = require('../utils/redis');
const intentES = require('../elasticsearch/intent');
const nodeDao = require('../daos/node');
const conditionDao = require('../daos/condition');
const actionDao = require('../daos/action');
const intentDao = require('../daos/intent');
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
} = require('../constants');

let actionResponse = [];
const parametersRequire = [];
let parameters = [];

const getAction = async (sessionId, usersay, resultQueue) => {
  // await client.delAsync(sessionId);
  let data = await client.getAsync(sessionId);
  // check session existed
  if (data) {
    data = JSON.parse(data);
    parameters = data.parameters;
    console.log(parameters, 'paramters');
    if (data.isMappingOneOne) {
      const response = await handleCheckRequireParamsAgain(
        sessionId,
        data,
        usersay,
        resultQueue,
      );
      return response;
    }
    return handleUserSayInWorkflow(sessionId, usersay, resultQueue, data);
  }
  // if not in session
  const response = await handleUsersaySend(sessionId, usersay, resultQueue);
  return response;
};

const handleUsersaySend = async (sessionId, usersay, resultQueue) => {
  const { hits } = await intentES.findIntent(
    usersay,
    '603325225c597b1fb4c9baa6',
  );
  if (hits.hits.length === 0) {
    return [
      {
        message: {
          text: 'Xin lỗi tôi không hiểu ý bạn',
        },
      },
    ];
  }
  const result = hits.hits.find((el) => el._score === hits.max_score);

  // find intent is start workflow
  const workflows = await nodeDao.findNodeIntentStartFlow(
    result.bot,
    result._id,
  );

  let intent = {};
  let workflow = null;
  if (workflows.length !== 0) {
    workflow = workflows[Math.floor(Math.random() * (workflows.length - 1))];
    intent = workflow.intent;
  } else {
    intent = await findIntentById(result._id);
  }

  // Check require parameter of intent
  const response = await requireParamsIntent(
    workflow,
    intent,
    usersay,
    sessionId,
    resultQueue,
  );

  if (response) {
    return response;
  }

  if (workflow || workflow.children.length !== 0) {
    await checkChildNode(sessionId, workflow, resultQueue);
    const responses = [...actionResponse];
    actionResponse = [];
    parameters = [];
    return responses;
  }
  return handleMappingOneOne(intent, resultQueue, sessionId);
};

const handleUserSayInWorkflow = async (
  sessionId,
  usersay,
  resultQueue,
  data,
) => {
  const currentNode = await nodeDao.findNodeById(data.currentNodeId);
  if (!currentNode) {
    // eslint-disable-next-line no-console
    console.log('currentNode not existed in redis');
    return null;
  }
  const listIntentId = currentNode.children.map((el) =>
    el.node.intent.toString(),
  );
  const { hits } = await intentES.findIntentByCondition(
    usersay,
    '603325225c597b1fb4c9baa6',
    listIntentId,
  );
  if (hits.hits.length === 0) {
    // Todo return require send again or break flow
    return [
      {
        message: {
          text: 'Xin lỗi tôi không hiểu ý bạn',
        },
      },
    ];
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
    resultQueue,
  );
  if (response) {
    return response;
  }
  if (intentNode.children.length !== 0) {
    await checkChildNode(sessionId, intentNode, resultQueue);
    const responses = [...actionResponse];
    actionResponse = [];
    parameters = [];
    return responses;
  }
  return handleMappingOneOne(intentNode.intent, resultQueue, sessionId);
};

const requireParamsIntent = async (
  workflow,
  intent,
  usersay,
  sessionId,
  resultQueue,
) => {
  const { PRODUCER } = global;
  for (let index = 0; index < intent.parameters.length; index++) {
    const el = JSON.parse(JSON.stringify(intent.parameters[index]));
    const parameter = getParameter(el.entity, usersay);
    if (!parameter && el.required) {
      parametersRequire.push(el);
    } else {
      // nếu parameter tìm thấy
      el.value = parameter[0];
      parameters.push(el);
    }
  }
  if (parametersRequire.length !== 0) {
    const data = {
      currentNodeId: workflow && workflow.children.length !== 0 && workflow._id,
      parametersRequire,
      intentId: intent._id,
      parameters,
      numberOfLoop: 0,
      isMappingOneOne: true,
    };
    await client.setAsync(sessionId, JSON.stringify(data));
    const response = handleResponse(
      parametersRequire[0].response.actionAskAgain,
      [parametersRequire[0]],
    );
    if (resultQueue) {
      await PRODUCER.sendToQueue(
        resultQueue,
        Buffer.from(JSON.stringify(response)),
      );
    }
    await client.delAsync(sessionId);
    return actionResponse.concat(response);
  }
  return null;
};

const checkChildNode = async (sessionId, currentNode, resultQueue) => {
  const { PRODUCER } = global;
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
        await client.setAsync(sessionId, JSON.stringify(data));
        return;
      case NODE_CONDITION:
        type = NODE_CONDITION;
        const check = await handleCondition(el);
        if (check) {
          const currentChildNode = await nodeDao.findNodeById(el.node._id);
          await checkChildNode(sessionId, currentChildNode, resultQueue);
          return;
        }
        break;
      case NODE_ACTION:
        const action = await actionDao.findActionByCondition({
          _id: el.node.action,
        });
        const response = handleResponse(action);
        if (resultQueue) {
          PRODUCER.sendToQueue(
            resultQueue,
            Buffer.from(JSON.stringify(response)),
          );
        }
        actionResponse = actionResponse.concat(response);
        const currentChildNode = await nodeDao.findNodeById(el.node._id);
        await checkChildNode(sessionId, currentChildNode, resultQueue);
        return;
      default:
        break;
    }
  }
  if (type === NODE_CONDITION) {
    // TODO handle action default
  }
};

const comparePosition = (x1, x2) => {
  return x1.node.position.x - x2.node.position.x;
};

const handleCondition = async (child) => {
  const condition = await conditionDao.findConditionByCondition({
    condition: { _id: child.node.condition },
  });
  const results = [];
  if (!condition) {
    return false;
  }
  for (const el of condition.conditions) {
    const valueParameter = parameters.find(
      (p) => p.parameterName === el.parameter,
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

const handleMappingOneOne = async (intent, resultQueue, sessionId) => {
  const { mappingAction } = intent;
  const { PRODUCER } = global;
  let response = null;
  if (mappingAction) {
    response = handleResponse(mappingAction);
  }
  if (resultQueue) {
    PRODUCER.sendToQueue(resultQueue, Buffer.from(JSON.stringify(response)));
  }
  await client.delAsync(sessionId);
  return response;
};

const handleCheckRequireParamsAgain = async (
  sessionId,
  data,
  usersay,
  resultQueue,
) => {
  const intent = await findIntentById(data.intentId);
  const currentParameter = await { ...data.parametersRequire[0] };
  const param = getParameter(currentParameter.entity, usersay);
  const newParameterRequire = [...data.parametersRequire];
  if (param === null) {
    // nếu parameter vẫn không tìm thấy
    if (data.numberOfLoop >= currentParameter.response.numberOfLoop) {
      // nếu quá số vòng lặp
      const response = handleResponse(
        currentParameter.response.actionBreak,
        [],
      );
      await client.delAsync(sessionId);
      return response;
    }
    // nếu không quá số vòng lặp
    data.numberOfLoop += 1;
    await client.setAsync(sessionId.toString(), JSON.stringify(data));
    const response = handleResponse(currentParameter.response.actionAskAgain, [
      currentParameter,
    ]);
    return response;
  }

  // nếu tìm thấy parameter trong lần hỏi tiếp theo
  currentParameter.value = param[0];
  data.parameters.push(currentParameter);
  newParameterRequire.splice(0, 1);
  const listIndex = [];
  // vòng lặp kiểm tra các parameter sau đó
  for (let i = 0; i < newParameterRequire.length; i++) {
    const element = newParameterRequire[i];
    const newParameter = getParameter(element.entity, usersay);
    if (newParameter === null && element.required) {
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
      await client.setAsync(sessionId, JSON.stringify(newData));
      const response = handleResponse(element.response.actionAskAgain, [
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
    return handleMappingOneOne(intent, resultQueue, sessionId);
  }
  const currentNode = await nodeDao.findNodeById(data.currentNodeId);
  await client.setAsync(sessionId, JSON.stringify(data));
  await checkChildNode(sessionId, currentNode, resultQueue);

  const responses = [...actionResponse];
  actionResponse = [];
  parameters = [];
  return responses;
};

const getParameter = (entity, usersay) => {
  let param;
  switch (entity.type) {
    case 1:
      param = entity.synonyms.find(
        (el) => el.input.findIndex((item) => usersay.indexOf(item) >= 0) > 0,
      );
      return (param && param.output) || param;
    case 2:
      param = usersay.match(entity.pattern);
      return param;
    default:
      return null;
  }
};

// no use for actionAskAgain
const handleResponse = (action) => {
  const response = action.actions.map(async (item) => {
    switch (item.typeAction) {
      case ACTION_TEXT:
        const text = item.text.map((el) => {
          for (let index = 0; index < parameters.length; index++) {
            const element = parameters[index];
            const replace = `{${element.parameterName}}`;
            el = el.replace(replace, element.value);
          }
          return el;
        });
        return {
          message: {
            text: text[Math.floor(Math.random() * (text.length - 1))],
          },
        };
      case ACTION_MEDIA:
        return {
          message: {
            text: item.media.description,
            attachment: {
              type: item.media.typeMedia,
              payload: {
                url: item.media.url,
              },
            },
          },
        };
      case ACTION_JSON_API:
        const { method, url, headers, body } = item.api;
        // eslint-disable-next-line no-unused-vars
        const data = await axios({
          method,
          url,
          headers: headers.reduce((a, b) => Object.assign(a, b), {}),
          body: body.reduce((a, b) => Object.assign(a, b), {}),
        });
        // todo get parameter
        return null;
      case ACTION_OPTION:
        return {
          message: {
            text: '<text>',
            attachment: {
              type: item.type,
              payload: {
                elements: item.options.map((el) => {
                  return {
                    label: el.name,
                    value: el.value,
                  };
                }),
              },
            },
          },
        };
      default:
        return null;
    }
  });
  return response.filter((el) => el !== null);
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

module.exports = {
  handleCheckRequireParamsAgain,
  handleUsersaySend,
  getAction,
};
