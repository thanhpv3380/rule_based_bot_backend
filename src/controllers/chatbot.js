const axios = require('axios');
const camelcaseKeys = require('camelcase-keys');
const chatbotService = require('../services/chatbot');
const actionDao = require('../daos/action');

const getAction = async (req, res) => {
  const { bot } = req;
  const { usersay } = req.query;
  console.time();
  const response = await chatbotService.getAction(
    `TEST${bot.id}`,
    usersay,
    null,
    bot.id,
  );
  console.timeEnd();
  res.send({ status: 1, result: response });
};

const testJsonApi = async (req, res) => {
  const { id } = req.query;
  const action = await actionDao.findActionByCondition({ _id: id });

  const item = action.actions.find((el) => el.typeAction === 'JSON_API');
  const { parameters } = item.api;

  const { method, url } = item.api;
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

  const parameter = parameters.map((el) => {
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
  res.send({ status: 1, parameter });
};

module.exports = {
  testJsonApi,
  getAction,
};
