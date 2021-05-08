const Message = require('../models/message');
const { findAll, findByCondition } = require('../utils/db');

const findAllMessage = async ({
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
    model: Message,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return {
    data,
    metadata,
  };
};

const findMessage = async (condition, fields, populate) => {
  const bot = await findByCondition(Message, condition, fields, populate);
  return bot;
};

const createMessage = async (data, userId) => {
  const bot = await Message.create({
    ...data,
    createBy: userId,
    users: [userId],
  });
  return bot;
};

const updateMessage = async (botId, data) => {
  const bot = await Message.findByIdAndUpdate(botId, data, {
    new: true,
  });
  return bot;
};

const deleteMessage = async (botId) => {
  await Message.findByIdAndDelete(botId);
};

module.exports = {
  findAllMessage,
  findMessage,
  createMessage,
  updateMessage,
  deleteMessage,
};
