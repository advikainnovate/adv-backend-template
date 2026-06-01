const Joi = require('joi');

const notificationTypeSchema = {
    create: {
        body: Joi.object().keys({
            categoryCode: Joi.string().trim().required(),
            code: Joi.string().trim().optional(),
            name: Joi.string().trim().required(),
            description: Joi.string().trim().allow('').optional(),
            priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('LOW'),
            throttleMinutes: Joi.number().integer().min(0).default(0),
            isActive: Joi.boolean().default(true),
        }),
    },
    update: {
        body: Joi.object().keys({
            categoryCode: Joi.string().trim().optional(),
            code: Joi.string().trim().optional(),
            name: Joi.string().trim().optional(),
            description: Joi.string().trim().allow('').optional(),
            priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional(),
            throttleMinutes: Joi.number().integer().min(0).optional(),
            isActive: Joi.boolean().optional(),
        }),
    },
};

module.exports = { notificationTypeSchema };
