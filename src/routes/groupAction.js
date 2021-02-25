/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const groupActionController = require('../controllers/groupAction');

router.get(
  '/groupActions',
  asyncMiddleware(groupActionController.getAllGroupAction),
);

router.post(
  '/groupActions/getGroupAndItems',
  asyncMiddleware(groupActionController.getAllGroupActionAndItem),
);

router.get(
  '/actions/:id',
  asyncMiddleware(groupActionController.getGroupActionById),
);

router.post(
  '/groupActions',
  asyncMiddleware(groupActionController.createGroupAction),
);

router.put(
  '/groupActions/:id',
  asyncMiddleware(groupActionController.updateGroupAction),
);

router.delete(
  '/groupActions/:id',
  asyncMiddleware(groupActionController.deleteGroupAction),
);

module.exports = router;
