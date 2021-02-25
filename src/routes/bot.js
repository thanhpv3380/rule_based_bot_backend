const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');
const { createValidate } = require('../validations/bot');
const { auth } = require('../middlewares/auth');

router.post(
  '/bots',
  auth,
  createValidate,
  asyncMiddleware(botController.create),
);
router.put('/bots', asyncMiddleware(botController.update));
router.get('/bots/:id', asyncMiddleware(botController.getBot));
router.delete('/bots/:id', asyncMiddleware(botController.deleteBot));
router.get('/bots', asyncMiddleware(botController.getBots));

module.exports = router;
