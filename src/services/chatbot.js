/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
// const CustomError = require('../errors/CustomError');
// const errorCodes = require('../errors/code');
const redisClient = require('redis');
const intentDao = require('../daos/intent');
const intentES = require('../elasticsearch/intent');

const client = redisClient.createClient(6379);

const handleUsersaySend = async (usersay, botId, userId) => {
  const { hits } = await intentES.findIntent(usersay);
  const result = hits.hits.find((el) => el._score === hits.max_score);
  const intent = await findIntent(result._id);
  for (let index = 0; index < intent.parameters.length; index++) {
    const el = intent.parameters[index];
    const parameter = usersay.match(el.entity.pattern);
    if (parameter === null && el.required) {
      const data = {
        parameterRequire: el,
        intent,
        userId,
        indexParam: index,
        parameters: intent.parameters.filter((item, i) => i < index),
        numberOfLoop: 0,
      };
      client.setex(botId, 3600, JSON.stringify(data));
      const response = handleResponse(el.response.actionAskAgain, [el]);
      return response;
    }
    // nếu parameter tìm thấy
    intent.parameters[index].value = parameter[0];
  }
  const { mappingAction } = intent;
  const response = handleResponse(mappingAction, intent.parameters);
  return response;
};

const handleUsersaySendAgain = async (botId, data, usersay) => {
  const param = usersay.match(data.parameterRequire.entity.pattern);
  if (param === null) {
    // nếu parameter vẫn không tìm thấy
    if (data.numberOfLoop >= data.parameterRequire.response.numberOfLoop) {
      // nếu quá số vòng lặp
      const response = handleResponse(
        data.parameterRequire.response.actionBreak,
        [],
      );
      client.del(botId);
      return response;
    }
    // nếu không quá số vòng lặp
    data.numberOfLoop += 1;
    client.set(botId, JSON.stringify(data));
    const response = handleResponse(
      data.parameterRequire.response.actionAskAgain,
      [data.parameterRequire],
    );
    return response;
  }

  // nếu tìm thấy parameter trong lần hỏi tiếp theo
  const { mappingAction } = data.intent;
  data.parameterRequire.value = param;
  data.parameters.push(data.parameterRequire);
  // vòng lặp kiểm tra các parameter sau đó
  for (let i = data.indexParam; i < data.intent.parameters.length; i++) {
    const element = data.intent.parameters[i];
    const newParameter = usersay.match(element.entity.pattern);
    if (newParameter === null && element.required) {
      // nếu parameter sau đó không tìm thấy
      const newData = {
        ...data,
        parameterRequire: element,
        indexParam: i,
        parameters: data.parameters,
        timeStart: new Date(),
        numberOfLoop: 0,
      };
      client.setex(botId, 3600, JSON.stringify(newData));
      const response = handleResponse(element.response.actionAskAgain, [
        element,
      ]);
      // xoá cache của parameter trước đó
      client.del(botId);
      return response;
    }
    // nếu parameter sau đó tìm thấy
    element.value = newParameter;
    data.parameters.push(element);
  }
  const response = handleResponse(mappingAction, data.parameters);
  // xoá cache của parameter trước đó
  client.del(botId);
  return response;
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

const findIntent = async (id) => {
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
  // getAction,
  handleUsersaySendAgain,
  handleUsersaySend,
};
