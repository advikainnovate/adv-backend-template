const Joi = require('joi');
const { CONSTANTS } = require('../../config');

const authSchema = {
    login: {
        body: Joi.object().keys({
            username: Joi.string().trim().email().trim().required(),
            password: Joi.string().trim().required(),
        }),
    },
    forgetPassword: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().trim().required(),
        }),
    },
    resetPassword: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().trim().required(),
            otp: Joi.string().trim().max(6).min(6).required(),
            newPassword: Joi.string().trim().required(),
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
};

module.exports = { authSchema };
