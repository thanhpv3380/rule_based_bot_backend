const {
  Types: { ObjectId },
} = require('mongoose');
const Entity = require('../models/entity');

const createEntity = async ({ name, createBy }) => {
  const entity = await Entity.create({ name, createBy });
  return entity;
};

const updateEntity = async ({ entityId, data }) => {
  const entity = await Entity.findByIdAndUpdate(entityId, data);
  return entity;
};

const findEntityByUserId = async ({ userId }) => {
  const entity = await Entity.find({ userId });
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

const findAllEntity = async (name) => {
  const entity = await Entity.find({ name: { $regex: name } });
  return entity;
};

const deleteEntity = async ({ id }) => {
  await Entity.findByIdAndDelete({ id });
};

module.exports = {
  createEntity,
  updateEntity,
  findEntityByUserId,
  findEntity,
  deleteEntity,
  findAllEntity,
};
