const MessageLog = require('../models/messageLog');
const { findAll, findByCondition } = require('../utils/db');

const findAllMessageLog = async ({
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
    model: MessageLog,
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

const findMessageLog = async (condition, fields, populate) => {
  const bot = await findByCondition(MessageLog, condition, fields, populate);
  return bot;
};

const createMessageLog = async (data) => {
  const message = await MessageLog.create(data);
  return message;
};

const updateMessageLog = async (botId, data) => {
  const message = await MessageLog.findByIdAndUpdate(botId, data, {
    new: true,
  });
  return message;
};

const deleteMessageLog = async (botId) => {
  await MessageLog.findByIdAndDelete(botId);
};

module.exports = {
  findAllMessageLog,
  findMessageLog,
  createMessageLog,
  updateMessageLog,
  deleteMessageLog,
};
