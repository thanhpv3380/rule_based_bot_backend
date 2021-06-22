const router = require('express').Router();
const uploadController = require('../controllers/upload');
const asyncMiddleware = require('../middlewares/async');

router.post('/uploads/file', asyncMiddleware(uploadController.uploadFile));

module.exports = router;
