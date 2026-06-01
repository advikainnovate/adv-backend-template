const { errorResponse, successResponse } = require('../../helpers');
const authService = require('./auth.service');

exports.login = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await authService.login(body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.forgetPassword = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await authService.forgetPassword(body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await authService.resetPassword(body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.logoutUser = async (req, res, next) => {
    try {
        const { user } = req;
        const response = await authService.logoutUser(user.id);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};
