const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const intentController = require('../controllers/intent');

router.post('/intents', asyncMiddleware(intentController.create));
router.put('/intents', asyncMiddleware(intentController.update));
router.get('/intents/:id', asyncMiddleware(intentController.getintent));
router.delete('/intents/:id', asyncMiddleware(intentController.deleteintent));

module.exports = router;