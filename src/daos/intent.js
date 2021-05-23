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
        _id: intentId,
        'parameters._id': parameterId,
      },
    },
  ]);
  if (parameter.length > 0) {
    return (
      (parameter[0].parameters && {
        name: parameter[0].parameters.parameterName,
        id: parameter[0].parameters._id,
      }) ||
      null
    );
  }
  return null;
};

const findParametersByList = async (data) => {
  const intents = await Intent.find({
    _id: { $in: data },
  });
  const parameters = [];
  intents.forEach((el) => parameters.push(...el.parameters));
  return parameters;
};

const deleteByCondition = async (condition) => {
  await Intent.remove(condition);
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
  findParametersByList,
  deleteByCondition,
};
