const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const entityController = require('../controllers/entity');

router.get(
  '/entities',
  auth,
  getBotId,
  asyncMiddleware(entityController.getAllEntityByBotId),
);
router.get(
  '/entities/:id',
  auth,
  getBotId,
  asyncMiddleware(entityController.getEntityById),
);
router.post(
  '/entities',
  auth,
  getBotId,
  asyncMiddleware(entityController.createEntity),
);
router.put(
  '/entities/:id',
  auth,
  getBotId,
  asyncMiddleware(entityController.updateEntity),
);
router.delete(
  '/entities/:id',
  auth,
  getBotId,
  asyncMiddleware(entityController.deleteEntity),
);

module.exports = router;
