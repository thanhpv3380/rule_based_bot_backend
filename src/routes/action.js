const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const {auth, getBotId} = require('../middlewares/auth');
const actionController = require('../controllers/action');

router.get(
  '/actions',
  auth,
  getBotId,
  asyncMiddleware(actionController.getAllActionByBotId),
);
router.get(
  '/actions/:id',
  auth,
  getBotId,
  asyncMiddleware(actionController.getActionById),
);
router.post(
  '/actions',
  auth,
  getBotId,
  asyncMiddleware(actionController.createAction),
);
router.put(
  '/actions/:id',
  auth,
  getBotId,
  asyncMiddleware(actionController.updateAction),
);
router.delete(
  '/actions/:id',
  auth,
  getBotId,
  asyncMiddleware(actionController.deleteAction),
);

module.exports = router;
