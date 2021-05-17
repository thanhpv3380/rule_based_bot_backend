const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const userController = require('../controllers/user');

router.get(
  '/accounts',
  auth,
  getBotId,
  asyncMiddleware(userController.getAllUser),
);

module.exports = router;
