const {
  Types: { ObjectId },
} = require('mongoose');
const Entity = require('../models/entity');
const { findAll, findByCondition } = require('../utils/db');

const findAllEntityByCondition = async ({
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

const findEntityByCondition = async (condition, fields, populate) => {
  const entity = await findByCondition(Entity, condition, fields, populate);
  return entity;
};

const createEntity = async ({
  _id,
  name,
  type,
  pattern,
  synonyms,
  patterns,
  userId,
  groupEntityId,
  botId,
}) => {
  const entity = await Entity.create({
    _id: _id || new ObjectId(),
    name,
    type,
    pattern,
    synonyms,
    patterns,
    createBy: userId,
    groupEntity: groupEntityId,
    bot: botId,
  });
  return entity;
};

const updateEntity = async (id, data) => {
  const entity = await Entity.findByIdAndUpdate(id, data, { new: true });
  return entity;
};

const deleteEntity = async (id) => {
  await Entity.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await Entity.remove(condition);
};

module.exports = {
  findAllEntityByCondition,
  findEntityByCondition,
  createEntity,
  updateEntity,
  deleteEntity,
  deleteByCondition,
};
