/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
// const CustomError = require('../errors/CustomError');
// const errorCodes = require('../errors/code');
const redisClient = require('redis');
const intentDao = require('../daos/intent');
const intentES = require('../elasticsearch/intent');

const getAction = async (botId, usersay, userId) => {
  let data = await getAsync(botId);

  if (data) {
    data = JSON.parse(data);
    const response = await handleUsersaySendAgain(
      botId,
      JSON.parse(data),
      usersay,
      client,
    );
    return response;
  }

  const response = await handleUsersaySend(usersay, botId, userId);
  return response;
};

const client = redisClient.createClient(6379);
const handleUsersaySend = async (usersay, botId, userId) => {
  const { hits } = await intentES.findIntent(usersay);
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
  const intent = await findIntentById(result._id);
  const parametersRequire = [];
  const parameters = [];
  for (let index = 0; index < intent.parameters.length; index++) {
    const el = intent.parameters[index];
    const parameter = getParameter(el.entity, usersay);
    if (parameter === null && el.required) {
      parametersRequire.push(el);
    } else {
      // nếu parameter tìm thấy
      el.value = parameter;
      parameters.push(el);
    }
  }
  if (parametersRequire.length !== 0) {
    const data = {
      parametersRequire,
      intentId: result._id,
      userId,
      parameters,
      numberOfLoop: 0,
    };
    client.setex(botId, 3600, JSON.stringify(data)); // Todo bất đồng độ
    const response = handleResponse(
      parametersRequire[0].response.actionAskAgain,
      [parametersRequire[0]],
    );
    return response;
  }
  const { mappingAction } = intent;
  const response = handleResponse(mappingAction, parameters);
  return response;
};

const handleUsersaySendAgain = async (botId, data, usersay) => {
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
      client.del(botId);
      return response;
    }
    // nếu không quá số vòng lặp
    data.numberOfLoop += 1;
    client.set(botId, JSON.stringify(data));
    const response = handleResponse(currentParameter.response.actionAskAgain, [
      currentParameter,
    ]);
    return response;
  }

  // nếu tìm thấy parameter trong lần hỏi tiếp theo
  const { mappingAction } = intent;
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
      };
      client.setex(botId, 3600, JSON.stringify(newData));
      const response = handleResponse(element.response.actionAskAgain, [
        element,
      ]);
      // xoá cache của parameter trước đó
      return response;
    }
    listIndex.push(i);
    // nếu parameter sau đó tìm thấy
    element.value = newParameter;
    data.parameters.push(element);
  }
  const response = handleResponse(mappingAction, data.parameters);
  // xoá cache của parameter trước đó
  client.del(botId);
  return response;
};

const getParameter = (entity, usersay) => {
  let param;
  switch (entity.type) {
    case '1':
      param = entity.synonyms.find(
        (el) => el.input.findIndex((item) => usersay.indexOf(item) >= 0) > 0,
      );
      return (param && param.output) || param;
    case '2':
      param = usersay.match(entity.pattern);
      return param;
    default:
      return null;
  }
};

// no use for actionAskAgain
const handleResponse = (action, parameters) => {
  const response = action.actions.map((item) => {
    switch (item.typeAction) {
      case 'TEXT':
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
      case 'MEDIA':
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
      default:
        return {
          message: {
            text: '<text>',
            attachment: {
              type: item.type,
              payload: {
                elements: item.option.map((el) => {
                  return {
                    label: el.name,
                    value: el.value,
                  };
                }),
              },
            },
          },
        };
    }
  });
  return response;
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
  handleUsersaySendAgain,
  handleUsersaySend,
  getAction,
};

// customerInfo: // chưa biết có lưu log hay ko tạm thời lấy để định danh sessionId
// message: ''
// result_queue:
// sessionId:
