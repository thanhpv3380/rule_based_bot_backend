/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const workFlowController = require('../controllers/workFlow');

router.post(
  '/workFlows',
  auth,
  getBotId,
  asyncMiddleware(workFlowController.create),
);

router.put('/workFlows/:id', auth, getBotId, workFlowController.update);

router.get(
  '/workFlows/:id',
  auth,
  getBotId,
  asyncMiddleware(workFlowController.getWorkFlowById),
);

router.put(
  '/workFlows/flowDraw/:id',
  auth,
  getBotId,
  workFlowController.updateNodes,
);

router.put(
  '/workFlows/addNode/:id',
  auth,
  getBotId,
  workFlowController.addNode,
);

router.put(
  '/workFlows/removeNode/:id',
  auth,
  getBotId,
  workFlowController.removeNode,
);
module.exports = router;
