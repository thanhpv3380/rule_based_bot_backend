const {
  Types: { ObjectId },
} = require('mongoose');
const moment = require('moment');
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
  let conversation = await conversationDao.findConversation({
    sessionId,
  });
  if (conversation === null) {
    // todo save conversation
    conversation = await conversationDao.createConversation({
      _id: new ObjectId(),
      sessionId,
      bot,
      workflow: data.workflowId,
    });
  }

  const message = await messageDao.createMessage({
    message: data.message,
    bot,
    conversation: conversation._id,
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
    await dashboardDao.createDashboard(newDashboard);
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
