/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const {auth, getBotId} = require('../middlewares/auth');
const groupIntentController = require('../controllers/groupIntent');

router.post(
  '/groupIntents/getGroupAndItems',
  auth,
  getBotId,
  asyncMiddleware(groupIntentController.getAllGroupIntentAndItem),
);
router.get(
  '/groupIntents/:id',
  auth,
  getBotId,
  asyncMiddleware(groupIntentController.getGroupIntentById),
);
router.post(
  '/groupIntents',
  auth,
  getBotId,
  asyncMiddleware(groupIntentController.createGroupIntent),
);
router.put(
  '/groupIntents/:id',
  auth,
  getBotId,
  asyncMiddleware(groupIntentController.updateGroupIntent),
);
router.delete(
  '/groupIntents/:id',
  auth,
  getBotId,
  asyncMiddleware(groupIntentController.deleteGroupIntent),
);

module.exports = router;
