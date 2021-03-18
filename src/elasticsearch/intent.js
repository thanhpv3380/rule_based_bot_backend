/* eslint-disable no-console */
const client = require('./connection.js');

const updateMutiUsersay = async (intent) => {
  await client.update(
    intent.patterns.map((el) => {
      return {
        index: 'usersay',
        id: el._id,
        body: {
          intentId: intent._id,
          usersay: el.usersay,
          parameters:
            el.parameters &&
            el.parameters.map((item) => {
              return {
                entity: item.entity,
                value: item.value,
              };
            }),
        },
        action: el.mappingAction,
      };
    }),
  );
};

const updateUsersay = async (intentId, pattern, action) => {
  await client.update({
    index: 'usersay',
    id: pattern._id,
    body: {
      intentId,
      usersay: pattern.usersay,
      parameters:
        pattern.parameters &&
        pattern.parameters.map((item) => {
          return {
            entity: item.entity,
            value: item.value,
          };
        }),
    },
    action,
  });
};

const findUsersay = async (usersay) => {
  const data = await client.search({
    index: 'usersay',
    body: {
      query: {
        match_phrase: { usersay },
      },
    },
  });
  return data;
};

const deleteUsersays = async (intentId) => {
  await client.delete({
    index: 'usersay',
    body: {
      intentId,
    },
  });
};

const deleteUsersay = async (id) => {
  await client.delete({
    index: 'usersay',
    id,
  });
};

module.exports = {
  updateMutiUsersay,
  updateUsersay,
  findUsersay,
  deleteUsersays,
  deleteUsersay,
};
