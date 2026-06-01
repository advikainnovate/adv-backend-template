const Joi = require('joi');

const queueSchema = {
    create: {
        body: Joi.object().keys({
            queueCode: Joi.string().trim().required(),
            priority: Joi.string().valid('HIGH', 'LOW').default('LOW'),
            description: Joi.string().allow('').optional(),
        }),
    },
    update: {
        body: Joi.object().keys({
            queueCode: Joi.string().trim().optional(),
            priority: Joi.string().valid('HIGH', 'LOW').optional(),
            description: Joi.string().allow('').optional(),
        }),
    },
};

module.exports = { queueSchema };
