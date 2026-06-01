const Joi = require('joi');

const userPreferenceSchema = {
    create: {
        body: Joi.object().keys({
            userId: Joi.string().trim().required(),
            userType: Joi.string().trim().required(),
            categoryCode: Joi.string().trim().required(),
            channel: Joi.string().trim().required(),
            isEnabled: Joi.boolean().default(true),
        }),
    },
    update: {
        body: Joi.object().keys({
            categoryCode: Joi.string().trim().optional(),
            channel: Joi.string().trim().optional(),
            isEnabled: Joi.boolean().optional(),
        }),
    },
};

module.exports = { userPreferenceSchema };
