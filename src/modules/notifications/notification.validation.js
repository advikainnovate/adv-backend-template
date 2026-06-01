const Joi = require('joi');

const notificationSchema = {
    send: {
        body: Joi.object().keys({
            userId: Joi.string().trim().required(),
            userType: Joi.string().trim().required(),
            notificationTypeCode: Joi.string().trim().required(),
            channel: Joi.alternatives().try(
                Joi.string().trim(),
                Joi.array().items(Joi.string().trim())
            ).optional(),
            recipient: Joi.string().trim().optional(),
            variables: Joi.object().optional(),
            metadata: Joi.object().optional(),
        }),
        query: Joi.object().keys({
            useQueue: Joi.boolean().optional(),
        }),
    },
    markAsRead: {
        params: Joi.object().keys({
            id: Joi.string().guid({ version: 'uuidv4' }).required(),
        }),
    },
    markAllAsRead: {
        query: Joi.object().keys({
            userId: Joi.string().trim().optional(),
            userType: Joi.string().trim().optional(),
        }),
    },
    getUnreadCount: {
        query: Joi.object().keys({
            userId: Joi.string().trim().optional(),
            userType: Joi.string().trim().optional(),
        }),
    },
};

module.exports = { notificationSchema };
