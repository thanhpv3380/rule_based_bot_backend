const router = require('express').Router();
const { auth, getAgentId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const dictionaryController = require('../controllers/dictionary');

router.get(
  '/dictionaries',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.getAllDictionary),
);
router.post(
  '/dictionaries/query',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.getAllDictionaryByCondition),
);
router.get(
  '/dictionaries/:id',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.getDictionaryById),
);
router.post(
  '/dictionaries',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.createDictionary),
);
router.put(
  '/dictionaries/:id',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.updateDictionary),
);
router.delete(
  '/dictionaries/:id',
  auth,
  getAgentId,
  asyncMiddleware(dictionaryController.deleteDictionary),
);

module.exports = router;
