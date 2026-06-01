const Joi = require('joi');

const notificationPayloadSchema = Joi.object({
    userId: Joi.string().required(),
    userType: Joi.string().required(),
    notificationTypeCode: Joi.string().required(),
    channel: Joi.string().valid('email', 'sms', 'push', 'web').required(),
    recipient: Joi.string().required(),
    variables: Joi.object().optional(),
    metadata: Joi.object().optional()
});

const testNotificationSchema = {
    withoutSqs: {
        body: notificationPayloadSchema
    },
    withSqs: {
        body: Joi.object({
            queueType: Joi.string().valid('ORDERS', 'PROMOTIONS').default('ORDERS'),
            payload: notificationPayloadSchema.required()
        })
    }
};

module.exports = { testNotificationSchema };
