const router = require('express').Router();
const { auth, getBotId } = require('../middlewares/auth');
const asyncMiddleware = require('../middlewares/async');
const permissionController = require('../controllers/permission');

router.get(
  '/permissions',
  auth,
  getBotId,
  asyncMiddleware(permissionController.getAllPermissionByBot),
);

router.get(
  '/permissions/:id',
  auth,
  getBotId,
  asyncMiddleware(permissionController.getPermissionById),
);
router.post(
  '/permissions',
  auth,
  getBotId,
  asyncMiddleware(permissionController.createPermission),
);
router.delete(
  '/permissions/:id',
  auth,
  getBotId,
  asyncMiddleware(permissionController.deletePermission),
);

module.exports = router;
