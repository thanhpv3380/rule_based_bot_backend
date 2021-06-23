const {
  Types: { ObjectId },
} = require('mongoose');
const moment = require('moment');
const { client } = require('../utils/redis');
const messageDao = require('../daos/message');
const dashboardDao = require('../daos/dashboard');
const conversationDao = require('../daos/conversation');
const {
  STATUS_DEFAULT,
  STATUS_ANSWERED,
  // STATUS_SILENCE,
  STATUS_NOT_UNDERSTAND,
  STATUS_NEED_CONFIRM,
} = require('../constants');

const handleLogMessage = async (data) => {
  const { bot, status, from, sessionId } = data;
  const session = await client.getAsync(`LOG${sessionId}`);
  let id = null;
  let conversation = await conversationDao.findConversation({
    sessionId,
  });
  console.log(session, 'session');
  if (!session && !conversation) {
    id = new ObjectId();
    await client.setAsync(`LOG${sessionId}`, id.toString());
    conversation = await conversationDao.createConversation({
      _id: id,
      sessionId,
      bot,
      workflow: data.workflowId,
    });
  } else {
    id = session;
    await client.delAsync(`LOG${sessionId}`);
  }

  const message = await messageDao.createMessage({
    message: data.message,
    bot,
    conversation: id,
    from,
    status,
  });
  if (from === 'USER') {
    await saveOrUpdateDashboard(message);
  }
};

const saveOrUpdateDashboard = async (message) => {
  const today = moment().startOf('day');

  const dashboardToday = await dashboardDao.findDashboardByCondition({
    createdAt: {
      $gte: today.toDate(),
      $lte: new Date(),
    },
  });
  if (dashboardToday) {
    const {
      totalUsersay,
      answeredUsersay,
      notUnderstandUsersay,
      defaultUsersay,
      needConfirmUsersay,
    } = dashboardToday;

    const newDashboard = handleDataDashboard(
      message.status,
      totalUsersay,
      answeredUsersay,
      notUnderstandUsersay,
      defaultUsersay,
      needConfirmUsersay,
    );
    await dashboardDao.updateDashboard(dashboardToday._id, newDashboard);
  } else {
    const newDashboard = handleDataDashboard(message.status, 0, 0, 0, 0, 0);
    await dashboardDao.createDashboard({ ...newDashboard, bot: message.bot });
  }
};

const handleDataDashboard = (
  messageStatus,
  totalUsersay,
  answeredUsersay,
  notUnderstandUsersay,
  defaultUsersay,
  needConfirmUsersay,
) => {
  totalUsersay += 1;
  switch (messageStatus) {
    case STATUS_DEFAULT:
      defaultUsersay += 1;
      break;
    case STATUS_ANSWERED:
      answeredUsersay += 1;
      break;
    case STATUS_NOT_UNDERSTAND:
      notUnderstandUsersay += 1;
      break;
    case STATUS_NEED_CONFIRM:
      needConfirmUsersay += 1;
      break;
    default:
      totalUsersay -= 1;
      break;
  }
  const dashboard = {
    totalUsersay,
    answeredUsersay,
    notUnderstandUsersay,
    defaultUsersay,
    needConfirmUsersay,
  };
  return dashboard;
};

module.exports = {
  handleLogMessage,
};
