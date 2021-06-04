/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const conditionController = require('../controllers/conversation');

router.get(
  '/conversations',
  auth,
  getBotId,
  asyncMiddleware(conditionController.getAllConversationByBotId),
);

router.get(
  '/conversations/:id',
  auth,
  getBotId,
  asyncMiddleware(conditionController.getConversationById),
);

module.exports = router;
