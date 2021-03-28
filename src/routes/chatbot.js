const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const {auth, getBotId} = require('../middlewares/auth');
const {checkCacheUsersay} = require('../middlewares/cache');
const chatbotController = require('../controllers/chatbot');

router.get(
  '/user/intent/getAction',
  auth,
  getBotId,
  checkCacheUsersay,
  asyncMiddleware(chatbotController.getAction),
);

module.exports = router;
