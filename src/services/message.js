const messageDao = require('../daos/message');

const handleLogMessage = async (data) => {
  const { sessionId, message, type } = data;
};

module.exports = {
  handleLogMessage,
};
