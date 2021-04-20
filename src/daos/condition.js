// const {
//   Types: { ObjectId },
// } = require('mongoose');
const Condition = require('../models/condition');
const { findAll, findByCondition } = require('../utils/db');

const findAllConditionByCondition = async ({
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
    model: Condition,
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

const findConditionByCondition = async ({ condition, fields, populate }) => {
  const intent = await findByCondition(Condition, condition, fields, populate);
  return intent;
};

const createCondition = async (data) => {
  const condition = await Condition.create(data);
  return condition;
};

const updateCondition = async (id, data) => {
  const condition = await Condition.findByIdAndUpdate(id, data, { new: true });
  return condition;
};

const deleteCondition = async (id) => {
  await Condition.findByIdAndDelete(id);
};

module.exports = {
  findAllConditionByCondition,
  findConditionByCondition,
  createCondition,
  updateCondition,
  deleteCondition,
};
