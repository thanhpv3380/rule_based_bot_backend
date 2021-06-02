const {
  Types: { ObjectId },
} = require('mongoose');
const Conversation = require('../models/conversation');
const { findAll, findByCondition } = require('../utils/db');

const findAllConversation = async ({
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
    model: Conversation,
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

const findConversation = async (condition, fields, populate) => {
  const bot = await findByCondition(Conversation, condition, fields, populate);
  return bot;
};

const findConversationAndItem = async ({ id }) => {
  const conversation = await Conversation.aggregate([
    {
      $match: { _id: ObjectId(id) },
    },
    {
      $lookup: {
        from: 'messages',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$conversation', '$$id'],
              },
            },
          },
          {
            $skip: 0,
          },
          {
            $limit: 10,
          },
        ],
        as: 'messages',
      },
    },
  ]);
  return conversation[0];
};

module.exports = {
  findAllConversation,
  findConversation,
  findConversationAndItem,
};
