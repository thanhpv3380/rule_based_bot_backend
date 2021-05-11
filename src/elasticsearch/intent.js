const client = require('./connection.js');

const createIntent = async (intent) => {
  await client.create({
    index: 'intents',
    id: intent._id.toString(),
    body: {
      patterns: intent.patterns,
      bot: intent.bot,
    },
  });
};

const updateIntent = async (intent) => {
  await client.update({
    index: 'intents',
    id: intent._id.toString(),
    body: {
      doc: {
        patterns: intent.patterns,
        bot: intent.bot,
      },
    },
  });
};

const findIntent = async (usersay, botId) => {
  const data = await client.search({
    index: 'intents',
    body: {
      query: {
        bool: {
          must: [
            {
              match: { patterns: usersay },
            },
          ],
          filter: [
            {
              term: { bot: botId.toString() },
            },
          ],
        },
      },
    },
  });
  return data;
};

const findIntentByCondition = async (usersay, botId, intents) => {
  const data = await client.search({
    index: 'intents',
    body: {
      query: {
        bool: {
          must: [
            {
              match: { patterns: usersay },
            },
          ],
          filter: [
            {
              ids: {
                values: intents,
              },
            },
            {
              term: { bot: botId.toString() },
            },
          ],
        },
      },
    },
  });
  return data;
};

const deleteIntent = async (id) => {
  await client.delete({
    index: 'intents',
    id,
  });
};

module.exports = {
  createIntent,
  updateIntent,
  findIntent,
  deleteIntent,
  findIntentByCondition,
};
