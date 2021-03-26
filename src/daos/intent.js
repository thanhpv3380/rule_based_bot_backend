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
  Intent.remove({ groupIntent: groupId });
};

module.exports = {
  createIntent,
  updateIntent,
  findIntentByCondition,
  findAllIntentByCondition,
  deleteIntent,
  deleteIntentByGroupId,
};
