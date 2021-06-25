/* eslint-disable radix */
const moment = require('moment');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const dashboardDao = require('../daos/dashboard');
const intentDao = require('../daos/intent');
const actionDao = require('../daos/action');
const workflowDao = require('../daos/workflow');

const findAllDashboard = async ({
  botId,
  key,
  searchFields,
  limit,
  offset,
  fields,
  sort,
  query,
}) => {
  const newSearchFields = searchFields ? searchFields.split(',') : null;
  const newFields = fields ? fields.split(',') : null;
  const newSort = sort ? sort.split(',') : null;
  const { data, metadata } = await dashboardDao.findAllDashboard({
    key,
    searchFields: newSearchFields,
    query: { ...query, bot: botId },
    offset,
    limit,
    fields: newFields,
    sort: newSort,
    populate: ['createBy'],
  });

  return { dictionaries: data, metadata };
};

const findDashboardByCondition = async (botId, startDate, endDate) => {
  const { data } = await dashboardDao.findAllDashboardByCondition({
    query: {
      bot: botId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    sort: ['createdAt_asc'],
  });
  const newDashboard =
    data.length !== 0
      ? data.reduce((currentValue, el) => {
          return {
            totalUsersay: currentValue.totalUsersay + el.totalUsersay,
            answeredUsersay: currentValue.answeredUsersay + el.answeredUsersay,
            notUnderstandUsersay:
              currentValue.notUnderstandUsersay + el.notUnderstandUsersay,
            defaultUsersay: currentValue.defaultUsersay + el.defaultUsersay,
            needConfirmUsersay:
              currentValue.needConfirmUsersay + el.needConfirmUsersay,
          };
        })
      : null;
  const rangeDate = Math.floor(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
  );
  const dashboards = [];
  for (let dateAgo = rangeDate; dateAgo >= 0; dateAgo -= 1) {
    const currentDate = moment(new Date(endDate))
      .subtract(dateAgo, 'day')
      .format('DD-MM-YYYY');
    const dashboard = data.find(
      (el) => currentDate === moment(el.createdAt).format('DD-MM-YYYY'),
    );
    if (dashboard) {
      dashboards.push({
        ...dashboard,
        createdAt: moment(dashboard.createdAt).format('DD-MM-YYYY'),
      });
    } else {
      dashboards.push({
        ...dashboard,
        totalUsersay: 0,
        answeredUsersay: 0,
        notUnderstandUsersay: 0,
        defaultUsersay: 0,
        needConfirmUsersay: 0,
        createdAt: moment(new Date(endDate))
          .subtract(dateAgo, 'day')
          .format('DD-MM-YYYY'),
      });
    }
  }
  const response = newDashboard
    ? {
        dashboards,
        statistics: {
          ...newDashboard,
          percent: {
            answeredUsersay:
              newDashboard.answeredUsersay / newDashboard.totalUsersay,
            notUnderstandUsersay:
              newDashboard.notUnderstandUsersay / newDashboard.totalUsersay,
            defaultUsersay:
              newDashboard.defaultUsersay / newDashboard.totalUsersay,
            needConfirmUsersay:
              newDashboard.needConfirmUsersay / newDashboard.totalUsersay,
          },
        },
      }
    : {
        dashboards,
        statistics: {
          totalUsersay: 0,
          answeredUsersay: 0,
          notUnderstandUsersay: 0,
          defaultUsersay: 0,
          needConfirmUsersay: 0,
          percent: {
            answeredUsersay: 0,
            notUnderstandUsersay: 0,
            defaultUsersay: 0,
            needConfirmUsersay: 0,
          },
        },
      };
  return response;
};

const getStatisticWorkingData = async (botId) => {
  const intents = await intentDao.findIntentsByBot({
    condition: { bot: botId },
    fields: null,
  });
  const actions = await actionDao.findAllActionByCondition({
    query: {
      bot: botId,
    },
  });
  const workflows = await workflowDao.findAllWorkflowByCondition({
    query: {
      bot: botId,
    },
  });
  return {
    totalIntent: intents.length,
    totalAction: actions.data.length,
    totalWorkflow: workflows.data.length,
  };
};

const createDashboard = async ({ acronym, original, userId, botId }) => {
  const dashboardExist = await dashboardDao.findDashboard({
    acronym,
    bot: botId,
  });

  if (dashboardExist) {
    throw new CustomError(errorCodes.ITEM_EXIST);
  }
  const dashboard = await dashboardDao.createDashboard({
    acronym,
    original,
    userId,
    botId,
  });
  return dashboard;
};

const updateDashboard = async (id, data) => {
  const dashboardExist = await dashboardDao.findDashboard({
    _id: id,
  });

  if (!dashboardExist) {
    throw new CustomError(errorCodes.NOT_FOUND);
  }

  const dashboard = await dashboardDao.updateDashboard(id, data);
  return dashboard;
};

const deleteDashboard = async (id) => {
  await dashboardDao.deleteDashboard(id);
};

module.exports = {
  findAllDashboard,
  findDashboardByCondition,
  getStatisticWorkingData,
  createDashboard,
  updateDashboard,
  deleteDashboard,
};
