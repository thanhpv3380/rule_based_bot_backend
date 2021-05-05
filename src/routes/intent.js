const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const intentController = require('../controllers/intent');
const { auth, getBotId } = require('../middlewares/auth');

router.post(
  '/intents',
  auth,
  getBotId,
  asyncMiddleware(intentController.create),
);
router.put(
  '/intents/:id',
  auth,
  getBotId,
  asyncMiddleware(intentController.update),
);
router.get('/intents/:id', asyncMiddleware(intentController.getIntent));
router.get(
  '/intents',
  auth,
  getBotId,
  asyncMiddleware(intentController.getListIntent),
);
router.delete('/intents/:id', asyncMiddleware(intentController.deleteIntent));
router.put(
  '/intents/patterns/:id',
  asyncMiddleware(intentController.updatePatternOfIntent),
);
router.put(
  '/intents/:id/addUsersay',
  asyncMiddleware(intentController.addUsersay),
);
router.put(
  '/intents/:id/removeUsersay',
  asyncMiddleware(intentController.removeUsersay),
);
router.put(
  '/intents/:id/addParameter',
  asyncMiddleware(intentController.addParameter),
);
router.put(
  '/intents/:id/removeParameter',
  asyncMiddleware(intentController.removeParameter),
);
router.post(
  '/intents/getParametersByList',
  auth,
  getBotId,
  asyncMiddleware(intentController.getParametersByList),
);

module.exports = router;
