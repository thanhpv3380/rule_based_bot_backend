const {
  Types: { ObjectId },
} = require('mongoose');
const Entity = require('../models/entity');
const { findAll, findByCondition } = require('../utils/db');

const createEntity = async ({ name, pattern, createBy }) => {
  const entity = await Entity.create({
    name,
    pattern,
    type: 'regex',
    createBy,
  });
  return entity;
};

const updateEntity = async (entityId, data) => {
  const entity = await Entity.findByIdAndUpdate(entityId, data);
  return entity;
};

const findEntity = async (condition) => {
  if (ObjectId.isValid(condition)) {
    const entity = await Entity.findById(condition);
    return entity;
  }
  if (typeof condition === 'object' && condition !== null) {
    const entity = await Entity.findOne(condition);
    return entity;
  }
  return null;
};

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
    model: Entity,
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

// const deleteEntity = async ({ id }) => {
//   await Entity.findByIdAndDelete({ id });
// };

module.exports = {
  createEntity,
  updateEntity,
  findEntity,
  // deleteEntity,
  findAllIntentByCondition,
};
