const router = require('express').Router();
const { auth, getBotId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const dashboardController = require('../controllers/dashboard');

router.get(
  '/dashboards',
  auth,
  getBotId,
  asyncMiddleware(dashboardController.filterDashboard),
);
router.get(
  '/dashboards/statisticWorkingData',
  auth,
  getBotId,
  asyncMiddleware(dashboardController.statisticWorkingData),
);

module.exports = router;
