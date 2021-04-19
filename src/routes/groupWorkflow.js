/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth, getBotId } = require('../middlewares/auth');
const groupWorkflowController = require('../controllers/groupWorkflow');

router.post(
  '/groupWorkflows/getGroupAndItems',
  auth,
  getBotId,
  asyncMiddleware(groupWorkflowController.getAllGroupWorkflowAndItem),
);
router.get(
  '/groupWorkflows/:id',
  auth,
  getBotId,
  asyncMiddleware(groupWorkflowController.getGroupWorkflowById),
);
router.post(
  '/groupWorkflows',
  auth,
  getBotId,
  asyncMiddleware(groupWorkflowController.createGroupWorkflow),
);
router.put(
  '/groupWorkflows/:id',
  auth,
  getBotId,
  asyncMiddleware(groupWorkflowController.updateGroupWorkflow),
);
router.delete(
  '/groupWorkflows/:id',
  auth,
  getBotId,
  asyncMiddleware(groupWorkflowController.deleteGroupWorkflow),
);

module.exports = router;
