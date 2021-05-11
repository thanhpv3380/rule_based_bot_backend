const dashboardService = require('../services/dashboard');

const create = async (req, res) => {
  const { user, bot } = req;
  const { operator, dashboards } = req.body;
  const data = {
    operator,
    dashboards,
    bot: bot.id,
    createBy: user.id,
  };
  const dashboard = await dashboardService.createDashboard(data);
  return res.send({ status: 1, result: dashboard });
};

const update = async (req, res) => {
  const { operator, dashboards } = req.body;
  //   const { id } = req.params;
  const data = {
    operator,
    dashboards,
  };
  // const dashboard = await dashboardService.updateDashboard(id, data);
  return res.send({ status: 1, result: data });
};

const filterDashboard = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { bot } = req;
  const dashboard = await dashboardService.findDashboardByCondition(
    bot.id,
    startDate,
    endDate,
  );
  return res.send({ status: 1, result: dashboard });
};

module.exports = {
  create,
  update,
  filterDashboard,
};
