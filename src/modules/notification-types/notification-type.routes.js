const express = require('express');
const router = express.Router();
const notificationTypeController = require('./notification-type.controller');
const validate = require('../../middlewares/validation');
const { notificationTypeSchema } = require('./notification-type.validation');

// Create a new notification type
router.post('/', validate(notificationTypeSchema.create), notificationTypeController.createType);

// Get all notification types
router.get('/', notificationTypeController.getAllTypes);

// Get notification type by ID
router.get('/:id', notificationTypeController.getTypeById);

// Get notification type by code
router.get('/code/:code', notificationTypeController.getTypeByCode);

// Update notification type
router.put('/:id', validate(notificationTypeSchema.update), notificationTypeController.updateType);

// Delete notification type (soft delete)
router.delete('/:id', notificationTypeController.deleteType);

module.exports = router;
