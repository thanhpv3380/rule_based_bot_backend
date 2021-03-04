const router = require('express').Router();
const { auth, getBotId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const dictionaryController = require('../controllers/dictionary');

router.get(
  '/dictionaries',
  auth,
  getBotId,
  asyncMiddleware(dictionaryController.getAllDictionary),
);
router.get(
  '/dictionaries/:id',
  auth,
  getBotId,
  asyncMiddleware(dictionaryController.getDictionaryById),
);
router.post(
  '/dictionaries',
  auth,
  getBotId,
  asyncMiddleware(dictionaryController.createDictionary),
);
router.put(
  '/dictionaries/:id',
  auth,
  getBotId,
  asyncMiddleware(dictionaryController.updateDictionary),
);
router.delete(
  '/dictionaries/:id',
  auth,
  getBotId,
  asyncMiddleware(dictionaryController.deleteDictionary),
);

module.exports = router;
