const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const nodeController = require('../controllers/node');

router.get(
  '/nodes/:id',
  auth,
  getBotId,
  asyncMiddleware(nodeController.getNodeById),
);
router.post(
  '/nodes',
  auth,
  getBotId,
  asyncMiddleware(nodeController.createNode),
);
router.put(
  '/nodes/:id',
  auth,
  getBotId,
  asyncMiddleware(nodeController.updateNode),
);
router.delete(
  '/nodes/:nodeId/workflow/:workflowId',
  auth,
  getBotId,
  asyncMiddleware(nodeController.deleteNode),
);
router.post(
  '/nodes/getParameters',
  auth,
  getBotId,
  asyncMiddleware(nodeController.getParameters),
);
module.exports = router;
