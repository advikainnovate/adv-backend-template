const Joi = require('joi');

const rolePreferenceSchema = {
    create: {
        body: Joi.object().keys({
            userType: Joi.string().trim().required(),
            categoryCode: Joi.string().trim().required(),
            channel: Joi.string().trim().required(),
            isEnabled: Joi.boolean().default(true),
        }),
    },
    update: {
        body: Joi.object().keys({
            userType: Joi.string().trim().optional(),
            categoryCode: Joi.string().trim().optional(),
            channel: Joi.string().trim().optional(),
            isEnabled: Joi.boolean().optional(),
        }),
    },
    bulkCreate: {
        body: Joi.object().keys({
            userTypes: Joi.array().items(Joi.string().trim().required()).min(1).required(),
            channels: Joi.array().items(Joi.string().trim().required()).min(1).required(),
            isEnabled: Joi.boolean().required(),
        }),
    },
};

module.exports = { rolePreferenceSchema };
