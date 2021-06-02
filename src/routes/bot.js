const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');

router.get('/bots', auth, asyncMiddleware(botController.getAllBotByRole));
router.get('/bots/:id', auth, asyncMiddleware(botController.getBotById));
router.post('/bots', auth, asyncMiddleware(botController.createBot));
router.put('/bots/:id', auth, asyncMiddleware(botController.updateBot));
router.delete('/bots/:id', auth, asyncMiddleware(botController.deleteBot));
router.get(
  '/bots/:id/add-user/:userId',
  auth,
  asyncMiddleware(botController.addUserInBot),
);
router.get(
  '/bots/:id/remove-user/:userId',
  auth,
  asyncMiddleware(botController.removeUserInBot),
);
router.get('/verify-bot-token', asyncMiddleware(botController.getBotByToken));

module.exports = router;
