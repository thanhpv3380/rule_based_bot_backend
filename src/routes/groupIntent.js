/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const groupIntentController = require('../controllers/groupIntent');

router.get(
  '/groupIntents',
  asyncMiddleware(groupIntentController.getAllGroupIntent),
);

router.get(
  '/groupIntents/:id',
  asyncMiddleware(groupIntentController.getGroupIntentById),
);

router.post(
  '/groupIntents',
  asyncMiddleware(groupIntentController.createGroupIntent),
);

router.put(
  '/groupIntents/:id',
  asyncMiddleware(groupIntentController.updateGroupIntent),
);

router.delete(
  '/groupIntents/:id',
  asyncMiddleware(groupIntentController.deleteGroupIntent),
);

module.exports = router;