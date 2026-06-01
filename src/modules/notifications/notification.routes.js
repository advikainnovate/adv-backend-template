const express = require('express');
const router = express.Router();
const notificationController = require('./notification.controller');
const validate = require('../../middlewares/validation');
const { optionalAuth } = require('../../middlewares');
const { notificationSchema } = require('./notification.validation');

// Send a notification
router.post('/send', validate(notificationSchema.send), notificationController.sendNotification);

// Get all notifications (with filters)
router.get('/', notificationController.getAllNotifications);

// Get unread notifications count
router.get('/unread-count', optionalAuth, validate(notificationSchema.getUnreadCount), notificationController.getUnreadCount);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

// Mark a single notification as read
router.patch('/:id/read', validate(notificationSchema.markAsRead), notificationController.markAsRead);

// Mark all notifications as read
router.post('/mark-all-read', optionalAuth, validate(notificationSchema.markAllAsRead), notificationController.markAllAsRead);

module.exports = router;
