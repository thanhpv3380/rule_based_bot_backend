const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');
const { createValidate } = require('../validations/bot');

router.post('/bots', asyncMiddleware(botController.create));
router.put('/bots', asyncMiddleware(botController.update));
router.get('/bots/:id', asyncMiddleware(botController.getBot));

module.exports = router;
