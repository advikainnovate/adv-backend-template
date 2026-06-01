const express = require('express');
const router = express.Router();
const testNotificationController = require('./test-notification.controller');
const validate = require('../../middlewares/validation');
const { testNotificationSchema } = require('./test-notification.validation');

router.post('/without-sqs', validate(testNotificationSchema.withoutSqs), testNotificationController.testWithoutSqs);
router.post('/with-sqs', validate(testNotificationSchema.withSqs), testNotificationController.testWithSqs);

module.exports = router;
