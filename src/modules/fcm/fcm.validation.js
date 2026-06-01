const Joi = require('joi');

const fcmSchema = {
    register: {
        body: Joi.object().keys({
            userId: Joi.string().trim().required(),
            userType: Joi.string().trim().required(),
            deviceToken: Joi.string().trim().required(),
            platform: Joi.string().valid('android', 'ios', 'web').optional(),
        }),
    },
    update: {
        body: Joi.object().keys({
            isActive: Joi.boolean().optional(),
            platform: Joi.string().valid('android', 'ios', 'web').optional(),
        }),
    },
    query: {
        query: Joi.object().keys({
            userId: Joi.string().trim().optional(),
            userType: Joi.string().trim().optional(),
            isActive: Joi.string().valid('true', 'false').optional(),
            platform: Joi.string().valid('android', 'ios', 'web').optional(),
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).optional(),
        }),
    },
    idParam: {
        params: Joi.object().keys({
            id: Joi.string().guid({ version: 'uuidv4' }).required(),
        }),
    },
};

module.exports = { fcmSchema };
