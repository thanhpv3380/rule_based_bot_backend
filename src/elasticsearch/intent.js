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

const findIntent = async (usersay) => {
  const data = await client.search({
    index: 'intents',
    body: {
      query: {
        match: { patterns: usersay },
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
};
