const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const intentController = require('../controllers/intent');

router.post('/intents', asyncMiddleware(intentController.create));
router.put('/intents', asyncMiddleware(intentController.update));
router.get('/intents/:id', asyncMiddleware(intentController.getIntent));
router.delete('/intents/:id', asyncMiddleware(intentController.deleteIntent));
router.put('/intents/patterns/:id', asyncMiddleware(intentController.updatePatternOfIntent));
router.delete('/intents/patterns/:id', asyncMiddleware(intentController.deletePatternOfIntent));

module.exports = router;