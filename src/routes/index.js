const express = require('express');
const router = express.Router();

const categoryRoutes = require('../modules/categories/category.routes');
const channelRoutes = require('../modules/channels/channel.routes');
const notificationTypeRoutes = require('../modules/notification-types/notification-type.routes');
const templateRoutes = require('../modules/templates/template.routes');
const userPreferenceRoutes = require('../modules/user-preferences/user-preference.routes');
const rolePreferenceRoutes = require('../modules/role-preferences/role-preference.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const fcmRoutes = require('../modules/fcm/fcm.routes');

router.use('/categories', categoryRoutes);
router.use('/channels', channelRoutes);
router.use('/notification-types', notificationTypeRoutes);
router.use('/templates', templateRoutes);
router.use('/user-preferences', userPreferenceRoutes);
router.use('/role-preferences', rolePreferenceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/fcm', fcmRoutes);
router.use('/notification-queue-sqs', require('../modules/notification-queues-sqs/notification-queue-sqs.routes'));
router.use('/test-notifications', require('../modules/test-notifications/test-notification.routes'));

module.exports = router;
