const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const workflowController = require('../controllers/workflow');

router.get(
  '/workflows',
  auth,
  getBotId,
  asyncMiddleware(workflowController.getAllWorkflowByBotId),
);
router.get(
  '/workflows/:id',
  auth,
  getBotId,
  asyncMiddleware(workflowController.getWorkflowById),
);
router.post(
  '/workflows',
  auth,
  getBotId,
  asyncMiddleware(workflowController.createWorkflow),
);
router.put(
  '/workflows/:id',
  auth,
  getBotId,
  asyncMiddleware(workflowController.updateWorkflow),
);
router.delete(
  '/workflows/:id',
  auth,
  getBotId,
  asyncMiddleware(workflowController.deleteWorkflow),
);
router.put(
  '/workFlows/flowDraw/:id',
  auth,
  getBotId,
  workflowController.updateNodes,
);

router.put(
  '/workFlows/addNode/:id',
  auth,
  getBotId,
  workflowController.addNode,
);

router.put(
  '/workFlows/removeNode/:id',
  auth,
  getBotId,
  workflowController.removeNode,
);

module.exports = router;
