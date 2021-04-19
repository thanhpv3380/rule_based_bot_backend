const router = require('express').Router();
const { auth, getBotId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const slotController = require('../controllers/slot');

router.get(
  '/slots',
  auth,
  getBotId,
  asyncMiddleware(slotController.getAllSlot),
);
router.get(
  '/slots/:id',
  auth,
  getBotId,
  asyncMiddleware(slotController.getSlotById),
);
router.post(
  '/slots',
  auth,
  getBotId,
  asyncMiddleware(slotController.createSlot),
);
router.put(
  '/slots/:id',
  auth,
  getBotId,
  asyncMiddleware(slotController.updateSlot),
);
router.delete(
  '/slots/:id',
  auth,
  getBotId,
  asyncMiddleware(slotController.deleteSlot),
);

module.exports = router;
