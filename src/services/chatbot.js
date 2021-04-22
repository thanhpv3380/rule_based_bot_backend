/* eslint-disable no-case-declarations */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
const {
  Types: { ObjectId },
} = require('mongoose');
const { client } = require('../utils/redis');
const intentDao = require('../daos/intent');
const intentES = require('../elasticsearch/intent');
const workflowDao = require('../daos/workflow');
const workFlow = require('../models/workFlow');

const getAction = async (sessionId, usersay) => {
  // check session
  // const data = await client.getAsync(sessionId);

  // if (data) {
  //   const response = await handleUsersaySendAgain(
  //     sessionId,
  //     JSON.parse(data),
  //     usersay,
  //   );
  //   return response;
  // }
  // if not in session
  const response = await handleUsersaySend(sessionId, usersay);
  return response;
};

const handleUsersaySend = async (sessionId, usersay) => {
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

  // find intent is start workflow
  const workflows = await workflowDao.findWorkflowByPropertyIntent(
    intent.bot,
    intent._id,
  );

  // todo tối ưu trong truy vấn
  // const workflow = workflows.find((el) => {
  //   // console.log(el);
  //   const nodeIntent = el.nodes.find(
  //     (node) => node.intent === intent._id.toString(),
  //   );
  //   if (nodeIntent) {
  //     const check = el.nodes.foreach((node) => {
  //       console.log(node, 'end');
  //       if (node.type === 'START' && nodeIntent.parent.includes(node._id)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //     if (check) {
  //       console.log(el, 'end');
  //       return true;
  //     }
  //   }
  //   return false;
  // });
  console.log(workflows);

  // const currentNode = workflows[0].nodes;
  // const
  return workflows;
  // const currentNode = workflow.nodes.find(el);
  // const data = {
  //   workflowId: workFlow._id,
  //   currentIntent:
  // };

  // todo ==========================

  // find intent if intent not in workflow
  // const intent = await findIntentById(result._id);

  // const parametersRequire = [];
  // const parameters = [];
  // for (let index = 0; index < intent.parameters.length; index++) {
  //   const el = intent.parameters[index];
  //   const parameter = getParameter(el.entity, usersay);
  //   if (parameter === null && el.required) {
  //     parametersRequire.push(el);
  //   } else {
  //     // nếu parameter tìm thấy
  //     el.value = parameter;
  //     parameters.push(el);
  //   }
  // }
  // if (parametersRequire.length !== 0) {
  //   const data = {
  //     parametersRequire,
  //     intentId: result._id,
  //     parameters,
  //     numberOfLoop: 0,
  //   };
  //   await client.lpushAsync(sessionId, JSON.stringify(data));
  //   const response = handleResponse(
  //     parametersRequire[0].response.actionAskAgain,
  //     [parametersRequire[0]],
  //   );
  //   return response;
  // }
  // const { mappingAction } = intent;
  // const response = handleResponse(mappingAction, parameters);
  // return response;
};

const handleUsersaySendAgain = async (sessionId, data, usersay) => {
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
    await client.setAsync(sessionId, JSON.stringify(data));
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
    data.parameters.push(element);
  }
  const response = handleResponse(mappingAction, data.parameters);
  // xoá cache của parameter trước đó
  await client.delAsync(sessionId);
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

// message: {text: ""}
// resultQueue:
// sessionId:
