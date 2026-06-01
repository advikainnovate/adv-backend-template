const Joi = require('joi');

const channelSchema = {
    create: {
        body: Joi.object().keys({
            code: Joi.string().trim().optional(),
            name: Joi.string().trim().required(),
            description: Joi.string().trim().allow('').optional(),
            isActive: Joi.boolean().default(true),
        }),
    },
    update: {
        body: Joi.object().keys({
            code: Joi.string().trim().optional(),
            name: Joi.string().trim().optional(),
            description: Joi.string().trim().allow('').optional(),
            isActive: Joi.boolean().optional(),
        }),
    },
};

module.exports = { channelSchema };
