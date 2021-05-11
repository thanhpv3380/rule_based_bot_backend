const moment = require('moment');
const messageLogDao = require('../daos/messageLog');
const dashboardDao = require('../daos/dashboard');
const {
  STATUS_DEFAULT,
  STATUS_ANSWERED,
  // STATUS_SILENCE,
  STATUS_NOT_UNDERSTAND,
} = require('../constants');

const handleLogMessage = async (data) => {
  const messageLog = await messageLogDao.createMessageLog(data);

  const today = moment().startOf('day');

  // const listMessageToday = await messageLogDao.findMessageLog({
  //   createdAt: {
  //     $gte: today.toDate(),
  //     $lte: new Date(),
  //   },
  // });
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
    } = dashboardToday;

    const newDashboard = handleDataDashboard(
      messageLog.status,
      totalUsersay,
      answeredUsersay,
      notUnderstandUsersay,
      defaultUsersay,
    );
    await dashboardDao.updateDashboard(dashboardToday._id, newDashboard);
  } else {
    const newDashboard = handleDataDashboard(messageLog.status, 0, 0, 0, 0);
    await dashboardDao.createDashboard(newDashboard);
  }
};

const handleDataDashboard = (
  messageStatus,
  totalUsersay,
  answeredUsersay,
  notUnderstandUsersay,
  defaultUsersay,
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
    default:
      totalUsersay -= 1;
      break;
  }
  const dashboard = {
    totalUsersay,
    answeredUsersay,
    notUnderstandUsersay,
    defaultUsersay,
  };
  return dashboard;
};

module.exports = {
  handleLogMessage,
};
