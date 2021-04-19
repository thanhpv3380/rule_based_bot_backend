/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const conditionController = require('../controllers/condition');

router.post(
  '/conditions',
  auth,
  getBotId,
  asyncMiddleware(conditionController.create),
);

router.put('/conditions/:id', auth, getBotId, conditionController.update);

router.get(
  '/conditions/:id',
  auth,
  getBotId,
  asyncMiddleware(conditionController.getConditionById),
);
module.exports = router;
