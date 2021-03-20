const router = require('express').Router();
const { auth, getBotId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const entityController = require('../controllers/entity');

router.get(
  '/entities',
  auth,
  getBotId,
  asyncMiddleware(entityController.getAllEntities),
);
// router.get(
//   '/dictionaries/:id',
//   auth,
//   getBotId,
//   asyncMiddleware(entityController.getEntityById),
// );
router.post(
  '/entities',
  auth,
  getBotId,
  asyncMiddleware(entityController.createEntity),
);
// router.put(
//   '/dictionaries/:id',
//   auth,
//   getBotId,
//   asyncMiddleware(entityController.updateEntity),
// );
// router.delete(
//   '/dictionaries/:id',
//   auth,
//   getBotId,
//   asyncMiddleware(entityController.deleteEntity),
// );

module.exports = router;
