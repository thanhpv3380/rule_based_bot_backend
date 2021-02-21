const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const actionController = require('../controllers/action');

router.get('/actions', asyncMiddleware(actionController.getAllAction));
router.get('/actions/:id', asyncMiddleware(actionController.getActionById));
router.post('/actions', asyncMiddleware(actionController.createAction));
router.put('/actions/:id', asyncMiddleware(actionController.updateAction));
router.delete('/actions/:id', asyncMiddleware(actionController.deleteAction));

module.exports = router;
