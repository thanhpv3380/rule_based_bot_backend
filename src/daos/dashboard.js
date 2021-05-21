const Dashboard = require('../models/dashboard');
const { findAll, findByCondition } = require('../utils/db');

const findAllDashboardByCondition = async ({
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
    model: Dashboard,
    key,
    searchFields,
    query,
    offset,
    limit,
    fields,
    sort,
    populate,
  });
  return { data, metadata };
};

const findDashboardByCondition = async (condition, fields, populate) => {
  const dashboard = await findByCondition(
    Dashboard,
    condition,
    fields,
    populate,
  );
  return dashboard;
};

const createDashboard = async (data) => {
  const dashboard = await Dashboard.create(data);
  return dashboard;
};

const updateDashboard = async (id, data) => {
  const dashboard = await Dashboard.findByIdAndUpdate(id, data, { new: true });
  return dashboard;
};

const deleteDashboard = async (id) => {
  await Dashboard.findByIdAndDelete(id);
};

const deleteByCondition = async (condition) => {
  await Dashboard.remove(condition);
};

module.exports = {
  findAllDashboardByCondition,
  findDashboardByCondition,
  createDashboard,
  updateDashboard,
  deleteDashboard,
  deleteByCondition,
};
