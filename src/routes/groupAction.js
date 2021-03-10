/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const groupActionController = require('../controllers/groupAction');

router.post(
  '/groupActions/getGroupAndItems',
  auth,
  getBotId,
  asyncMiddleware(groupActionController.getAllGroupActionAndItem),
);
router.get(
  '/groupActions/:id',
  auth,
  getBotId,
  asyncMiddleware(groupActionController.getGroupActionById),
);
router.post(
  '/groupActions',
  auth,
  getBotId,
  asyncMiddleware(groupActionController.createGroupAction),
);
router.put(
  '/groupActions/:id',
  auth,
  getBotId,
  asyncMiddleware(groupActionController.updateGroupAction),
);
router.delete(
  '/groupActions/:id',
  auth,
  getBotId,
  asyncMiddleware(groupActionController.deleteGroupAction),
);

module.exports = router;
