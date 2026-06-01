const Joi = require('joi');
const { CONSTANTS } = require('../../config');

const userSchema = {
    register: {
        body: Joi.object().keys({
            userType: Joi.string().valid(...Object.values(CONSTANTS.ROLE)).required(),
            display_name: Joi.string().trim().optional(),
            email: Joi.string().trim().email().trim().required(),
            countryCode: Joi.string().trim().required(),
            phoneNumber: Joi.string().trim().required(),
            password: Joi.string().trim().required(),
            gender: Joi.string().valid('male', 'female', 'other').required(),
        }),
    },
    profileRegister: {
        body: Joi.object().keys({
            idProof: Joi.string().trim().optional(),
            idProofDoc: Joi.string().trim().optional(),
            addressProof: Joi.string().trim().optional(),
            addressProofDoc: Joi.string().trim().optional(),
            displayPic: Joi.string().trim().optional(),
            description: Joi.string().trim().optional(),
        }),
    },
    update: {
        body: Joi.object().keys({
            gender: Joi.string().valid('male', 'female', 'other').optional(),
            display_name: Joi.string().trim().optional(),
        }),
    },
    changePassword: {
        body: Joi.object().keys({
            currentPassword: Joi.string().trim().required(),
            newPassword: Joi.string().trim().required().invalid(Joi.ref('currentPassword')).messages({
                'any.invalid': 'New password must be different from current password',
            }),
            confirmPassword: Joi.string().trim().required().valid(Joi.ref('newPassword')).messages({
                'any.only': 'Confirm password must match new password',
            }),
        }),
    },
    findDisplayName: {
        body: Joi.object().keys({
            display_name: Joi.string().trim().required(),
        }),
    },
    updateStatus: {
        body: Joi.object().keys({
            status: Joi.string().trim().required(),
        }),
    },
};

module.exports = { userSchema };
