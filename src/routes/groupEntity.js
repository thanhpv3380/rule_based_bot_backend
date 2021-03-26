/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const groupEntityController = require('../controllers/groupEntity');

router.post(
  '/groupEntities/getGroupAndItems',
  auth,
  getBotId,
  asyncMiddleware(groupEntityController.getAllGroupEntityAndItem),
);
router.get(
  '/groupEntities/:id',
  auth,
  getBotId,
  asyncMiddleware(groupEntityController.getGroupEntityById),
);
router.post(
  '/groupEntities',
  auth,
  getBotId,
  asyncMiddleware(groupEntityController.createGroupEntity),
);
router.put(
  '/groupEntities/:id',
  auth,
  getBotId,
  asyncMiddleware(groupEntityController.updateGroupEntity),
);
router.delete(
  '/groupEntities/:id',
  auth,
  getBotId,
  asyncMiddleware(groupEntityController.deleteGroupEntity),
);

module.exports = router;
