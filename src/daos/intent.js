const {
  Types: { ObjectId },
} = require('mongoose');
const Intent = require('../models/intent');

const { findAll, findByCondition } = require('../utils/db');

const findAllIntentByCondition = async ({
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

const findIntentByCondition = async ({ condition, fields, populate }) => {
  const intent = await findByCondition(Intent, condition, fields, populate);
  return intent;
};

const findIntentsByBot = async ({ condition, fields }) => {
  const intent = await Intent.find(condition, fields);
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

const deleteIntent = async (id) => {
  await Intent.findByIdAndDelete(id);
};

const deleteIntentByGroupId = async (groupId) => {
  await Intent.remove({ groupIntent: groupId });
};

const findParameterById = async (intentId, parameterId) => {
  const parameter = await Intent.aggregate([
    { $unwind: '$parameters' },
    {
      $match: {
        // _id: ObjectId(intentId),
        'parameters._id': parameterId,
      },
    },
  ]);
  return (
    (parameter[0].parameters && {
      name: parameter[0].parameters.parameterName,
      id: parameter[0].parameters._id,
    }) ||
    null
  );
};

module.exports = {
  createIntent,
  updateIntent,
  findParameterById,
  findIntentByCondition,
  findAllIntentByCondition,
  findIntentsByBot,
  deleteIntent,
  deleteIntentByGroupId,
};
