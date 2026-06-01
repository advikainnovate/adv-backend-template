const { errorResponse, successResponse } = require('../../helpers');
const userService = require('./user.service');

exports.register = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await userService.register(body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.profile = async (req, res, next) => {
    try {
        const { user } = req;
        const response = await userService.profile(user.id);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.checkDisplayName = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await userService.checkDisplayName(body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.getDashboard = async (req, res, next) => {
    try {
        const { query } = req;
        const response = await userService.getDashboard(query);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

// get All Persmi
exports.getAllUsers = async (req, res, next) => {
    try {
        const { query } = req;
        const response = await userService.getAllUsers(query);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.getAllUserDropdown = async (req, res, next) => {
    try {
        const { query } = req;
        const response = await userService.getAllUserDropdown(query);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.findUser = async (req, res, next) => {
    try {
        const { params } = req;
        const response = await userService.findUser(params.id);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { params, body } = req;
        const response = await userService.changePassword(params.id, body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, { id: response.data.id });
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { params, body } = req;
        const response = await userService.updateUser(params.id, body);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { params } = req;
        const response = await userService.deleteUser(params.id);
        if (!response.success) {
            return errorResponse(res, response.code, response.message, response.data);
        }
        return successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};
