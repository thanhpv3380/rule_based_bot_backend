/* eslint-disable no-console */
const client = require('./connection.js');

const createUsersay = async (intentId, pattern, action) => {
  await client.create({
    index: 'usersays',
    id: pattern._id.toString(),
    body: {
      intent: intentId.toString(),
      usersay: pattern.usersay,
      action,
      parameters:
        pattern.parameters &&
        pattern.parameters.map((item) => {
          return {
            entity: item.entity,
            value: item.value,
          };
        }),
    },
  });
};

const updateMutiUsersay = (intent) => {
  intent.patterns.map(async (el) => {
    client.update({
      index: 'usersays',
      id: el._id.toString(),
      body: {
        intent: intent._id.toString(),
        usersay: el.usersay,
        action: intent.mappingAction,
        parameters:
          el.parameters &&
          el.parameters.map((item) => {
            return {
              entity: item.entity,
              value: item.value,
              type: item.type,
              pattern: item.pattern,
            };
          }),
      },
    });
  });
};

const updateUsersay = async (intentId, pattern, action) => {
  await client.update({
    index: 'usersays',
    id: pattern._id,
    body: {
      intent: intentId.toString(),
      usersay: pattern.usersay,
      action,
      parameters:
        pattern.parameters &&
        pattern.parameters.map((item) => {
          return {
            entity: item.entity,
            value: item.value,
          };
        }),
    },
  });
};

const findUsersay = async (usersay) => {
  const data = await client.search({
    index: 'usersays',
    body: {
      query: {
        match: { usersay },
      },
    },
  });
  return data;
};

const deleteUsersays = async (intentId) => {
  await client.delete({
    index: 'usersays',
    body: {
      intentId,
    },
  });
};

const deleteUsersay = async (id) => {
  await client.delete({
    index: 'usersays',
    id,
  });
};

module.exports = {
  createUsersay,
  updateMutiUsersay,
  updateUsersay,
  findUsersay,
  deleteUsersays,
  deleteUsersay,
};
