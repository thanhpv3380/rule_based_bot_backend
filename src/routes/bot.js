const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');
const { createValidate } = require('../validations/bot');

router.post('/bot/create', createValidate, asyncMiddleware(botController.create));
router.post('/bot/update', asyncMiddleware(botController.update));
router.get('/bot/{id}', asyncMiddleware(botController.getBot));

module.exports = router;