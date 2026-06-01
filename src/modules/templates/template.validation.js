const Joi = require('joi');

const templateSchema = {
    create: {
        body: Joi.object().keys({
            templateCode: Joi.string().trim().required(),
            notificationTypeCode: Joi.string().trim().required(),
            categoryCode: Joi.string().trim().required(),
            channel: Joi.string().trim().required(),
            userType: Joi.string().trim().required(),
            subject: Joi.string().trim().allow('').optional(),
            body: Joi.string().trim().required(),
            variables: Joi.array().items(Joi.string()).default([]),
            isActive: Joi.boolean().default(true),
        }),
    },
    update: {
        body: Joi.object().keys({
            templateCode: Joi.string().trim().optional(),
            notificationTypeCode: Joi.string().trim().optional(),
            categoryCode: Joi.string().trim().optional(),
            channel: Joi.string().trim().optional(),
            userType: Joi.string().trim().optional(),
            subject: Joi.string().trim().allow('').optional(),
            body: Joi.string().trim().optional(),
            variables: Joi.array().items(Joi.string()).optional(),
            isActive: Joi.boolean().optional(),
        }),
    },
};

module.exports = { templateSchema };
