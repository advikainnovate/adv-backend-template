const fcmService = require('./fcm.service');
const { successResponse } = require('../../helpers/response');

const registerToken = async (req, res, next) => {
    try {
        const result = await fcmService.registerToken(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllTokens = async (req, res, next) => {
    try {
        const result = await fcmService.getAllTokens(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getTokenById = async (req, res, next) => {
    try {
        const result = await fcmService.getTokenById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getActiveToken = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.role;
        
        const result = await fcmService.getActiveTokenByUserId(userId, userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const unregisterTokens = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userType = req.user.role;
        
        const result = await fcmService.unregisterTokens(userId, userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerToken,
    getAllTokens,
    getTokenById,
    getActiveToken,
    unregisterTokens,
};
