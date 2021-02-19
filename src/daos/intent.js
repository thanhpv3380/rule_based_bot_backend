const {
  Types: { ObjectId },
} = require('mongoose');
const Intent = require('../models/intent');

const createIntent = async (data) => {
  const intent = await Intent.create(data);
  return intent;
};

const updateIntent = async (id, data) => {
  const intent = await Intent.findOneAndUpdate({ _id: id }, data);
  return intent;
};

const findIntentById = async (id) => {
  Intent.search(
    {
      match: { _id: id },
    },
    function (err, result) {
      let intent = result.hits.hits.find((data) => data);
      console.log(intent, ' test Dao');
      return intent;
    },
  );
};

const findAllIntentOfGroup = async (id) => {
  Intent.search(
    {
      query: { ids: ['600b0ac07ddf963008ac6008', '600b0b177ddf963008ac600c'] },
    },
    function (err, result) {
      let intent = result.hits.hits.find((data) => data);
      console.log(intent, ' all intent');
      return intent;
    },
  );
};

const findIntentByName = async ({ name }) => {
  Intent.search(
    {
      query_string: { query: name },
    },
    function (err, result) {
      let intent = result.hits.hits.find((data) => data);
      console.log(intent, ' test find name Dao');
      return intent;
    },
  );
};

const deleteIntent = async (id) => {
  Intent.findById(id, function (err, intent) {
    if (err) {
      console.log('not found');
      return;
    } else if (intent == null) {
      return;
    }
    intent.remove(function (err1, intent) {
      if (err1) {
        console.log('err remove ', err1);
        return;
      }
    });
  });
};

module.exports = {
  createIntent,
  updateIntent,
  findIntentById,
  findAllIntentOfGroup,
  findIntentByName,
  deleteIntent,
};
