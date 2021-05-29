const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const botController = require('../controllers/bot');

router.get('/bots', auth, asyncMiddleware(botController.getAllBotByRole));
router.get('/bots/:id', auth, asyncMiddleware(botController.getBotById));
router.post('/bots', auth, asyncMiddleware(botController.createBot));
router.put('/bots/:id', auth, asyncMiddleware(botController.updateBot));
router.delete('/bots/:id', auth, asyncMiddleware(botController.deleteBot));
router.get('/bots/:id/role', auth, asyncMiddleware(botController.getRoleInBot));
router.get('/verify-bot-token', asyncMiddleware(botController.getBotByToken));

router.put(
  '/bots/:id/add-permission',
  auth,
  asyncMiddleware(botController.addPermission),
);
router.put(
  '/bots/:id/delete-permission/:userId',
  auth,
  asyncMiddleware(botController.deletePermission),
);
module.exports = router;
