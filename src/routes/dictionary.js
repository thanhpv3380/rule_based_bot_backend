const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const dictionaryController = require('../controllers/dictionary');

router.get(
  '/dictionaries',
  asyncMiddleware(dictionaryController.getAllDictionary),
);
router.get(
  '/dictionaries/:id',
  asyncMiddleware(dictionaryController.getDictionaryById),
);
router.post(
  '/dictionaries',
  asyncMiddleware(dictionaryController.createDictionary),
);
router.put(
  '/dictionaries/:id',
  asyncMiddleware(dictionaryController.updateDictionary),
);
router.delete(
  '/dictionaries/:id',
  asyncMiddleware(dictionaryController.deleteDictionary),
);

module.exports = router;
