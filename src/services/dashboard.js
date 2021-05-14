/* eslint-disable radix */
const moment = require('moment');
const CustomError = require('../errors/CustomError');
const errorCodes = require('../errors/code');
const { v4: uuidv4 } = require('uuid');
const dashboardDao = require('../daos/dashboard');

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
    bot: botId,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
    sort: ['createdAt_asc'],
  });
  const newDashboard = data.reduce((currentValue, el) => {
    return {
      totalUsersay: currentValue.totalUsersay + el.totalUsersay,
      answeredUsersay: currentValue.answeredUsersay + el.answeredUsersay,
      notUnderstandUsersay:
        currentValue.notUnderstandUsersay + el.notUnderstandUsersay,
      defaultUsersay: currentValue.defaultUsersay + el.defaultUsersay,
      needConfirmUsersay:
        currentValue.needConfirmUsersay + el.needConfirmUsersay,
    };
  });
  const rangeDate = Math.floor(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
  );
  const dashboards = [];
  for (let dateAgo = rangeDate; dateAgo >= 0; dateAgo -= 1) {
    for (const dashboard of data) {
      const currentDate = moment(new Date(endDate))
        .subtract(dateAgo, 'day')
        .format('DD-MM-YYYY');
      if (currentDate === moment(dashboard.createdAt).format('DD-MM-YYYY')) {
        dashboards.push({
          ...dashboard,
          createdAt: moment(dashboard.createdAt).format('DD-MM-YYYY'),
        });
        break;
      } else {
        dashboards.push({
          ...dashboard,
          totalUsersay: 0,
          answeredUsersay: 0,
          notUnderstandUsersay: 0,
          defaultUsersay: 0,
          needConfirmUsersay: 0,
          createdAt: moment(endDate)
            .subtract(dateAgo, 'day')
            .format('DD-MM-YYYY'),
        });
      }
    }
  }
  const response = {
    dashboards,
    statistics: {
      ...newDashboard,
      percent: {
        answeredUsersay:
          newDashboard.answeredUsersay / newDashboard.totalUsersay,
        notUnderstandUsersay:
          newDashboard.notUnderstandUsersay / newDashboard.totalUsersay,
        defaultUsersay: newDashboard.defaultUsersay / newDashboard.totalUsersay,
        needConfirmUsersay:
          newDashboard.needConfirmUsersay / newDashboard.totalUsersay,
      },
    },
  };
  return response;
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
  createDashboard,
  updateDashboard,
  deleteDashboard,
};
