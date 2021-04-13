/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
// const {
//   Types: { ObjectId },
// } = require('mongoose');

// function getMessageFromResult(result) {
//   const response = action.actions.map((item) => {
//     switch (item.typeAction) {
//       case 'TEXT':
//         const text = item.text.map((el) => {
//           for (let index = 0; index < parameters.length; index++) {
//             const element = parameters[index];
//             const replace = `{${element.parameterName}}`;
//             el = el.replace(replace, element.value);
//           }
//           return el;
//         });
//         return {
//           message: {
//             text: text[Math.floor(Math.random() * (text.length - 1))],
//           },
//         };
//       case 'MEDIA':
//         return {
//           message: {
//             text: item.media.description,
//             attachment: {
//               type: item.media.typeMedia,
//               payload: {
//                 url: item.media.url,
//               },
//             },
//           },
//         };
//       default:
//         return {
//           message: {
//             text: '<text>',
//             attachment: {
//               type: item.type,
//               payload: {
//                 elements: item.option.map((el) => {
//                   return {
//                     label: el.name,
//                     value: el.value,
//                   };
//                 }),
//               },
//             },
//           },
//         };
//     }
//   });
//   return response;
// }

// async function handleResponse(data, isAgentChat = false) {
//   const { sessionId } = data;
//   data.isAgentChat = isAgentChat;

//   await redisClient.lpushAsync(
//     `LIVECHAT_RESPONSE_${sessionId}`,
//     JSON.stringify(data),
//   );
//   await runResponseQueue(sessionId);
// }

// module.exports = { handleResponse, runResponseQueue };
