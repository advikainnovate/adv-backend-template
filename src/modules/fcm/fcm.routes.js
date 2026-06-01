const express = require('express');
const router = express.Router();
const fcmController = require('./fcm.controller');
const validate = require('../../middlewares/validation');
const { validateAccessToken } = require('../../middlewares');
const { CONSTANTS } = require('../../config');
const { fcmSchema } = require('./fcm.validation');

// Register or update a device token
router.post('/', validate(fcmSchema.register), fcmController.registerToken);

// Get active device token for the currently authenticated user (retrieved from JWT auth token)
router.get('/user/token', validateAccessToken(Object.values(CONSTANTS.ROLE)), fcmController.getActiveToken);

// Unregister all device tokens for the currently authenticated user (retrieved from JWT auth token)
router.delete('/unregister', validateAccessToken(Object.values(CONSTANTS.ROLE)), fcmController.unregisterTokens);

// Get all device tokens (with pagination and filters)
router.get('/', validate(fcmSchema.query), fcmController.getAllTokens);

// Get a device token by ID
router.get('/:id', validate(fcmSchema.idParam), fcmController.getTokenById);

module.exports = router;
