const {
  Types: { ObjectId },
} = require('mongoose');
const { populate } = require('../models/intent');
const Intent = require('../models/intent');
const { findAll, findByCondition } = require('../utils/db');

const findAllIntentByGroupIntentId = async ({
  key,
  searchFields,
  query,
  offset,
  limit,
  fields,
  sort,
  populate,
}) => {
  const { data, metadata } = await findAll({
    model: Intent,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return { data, metadata };
};

const findIntentByCondition = async (condition, fields, populate) => {
  const intent = await findByCondition(Intent, condition, fields, populate);
  return intent;
};

const createIntent = async (data) => {
  const intent = await Intent.create(data);
  return intent;
};

const updateIntent = async (id, data) => {
  const intent = await Intent.findByIdAndUpdate(id, data, {
    new: true,
  });
  return intent;
};

const findIntentById = async (id) => {
  const intent = await Intent.findOne({ _id: id });
  return intent;
};

// const findAllIntentOfGroup = async (id) => {
//   Intent.search(
//     {
//       query: { ids: ['600b0ac07ddf963008ac6008', '600b0b177ddf963008ac600c'] },
//     },
//     function (err, result) {
//       const intent = result.hits.hits.find((data) => data);
//       console.log(intent, ' all intent');
//       return intent;
//     },
//   );
// };

const findIntentByName = async ({ name }) => {
  await Intent.search(
    {
      query_string: { query: name },
    },
    function (err, result) {
      const intent = result.hits.hits.find((data) => data);
      return intent;
    },
  );
};

const deleteIntent = async (id) => {
  Intent.findById(id, function (err, intent) {
    if (err) {
      console.log('not found');
      return;
    }
    if (intent == null) {
      return;
    }
    intent.remove(function (err1, intent) {
      if (err1) {
        console.log('err remove ', err1);
      }
    });
  });
};

const deleteIntentByGroupId = (groupId) => {
  Intent.remove({ groupIntent: groupId });
};

module.exports = {
  createIntent,
  updateIntent,
  findIntentById,
  findIntentByCondition,
  findAllIntentByGroupIntentId,
  findIntentByName,
  deleteIntent,
  deleteIntentByGroupId,
};
