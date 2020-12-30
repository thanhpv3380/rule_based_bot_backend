/* eslint-disable no-unused-vars */
const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async');
const { auth } = require('../middlewares/auth');
const actionController = require('../controllers/auth');

router.get('/actions', asyncMiddleware(actionController.register));
router.get('/actions/:id', asyncMiddleware(actionController.register));
router.post('/actions', asyncMiddleware(actionController.register));
router.put('/actions/:id', asyncMiddleware(actionController.register));
router.delete('/actions/Lid', asyncMiddleware(actionController.register));

module.exports = router;
