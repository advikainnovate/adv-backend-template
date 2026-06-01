const userPreferenceService = require('./user-preference.service');
const { successResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');

const createPreference = async (req, res, next) => {
    try {
        const result = await userPreferenceService.createPreference(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllPreferences = async (req, res, next) => {
    try {
        const result = await userPreferenceService.getAllPreferences(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getUserPreferences = async (req, res, next) => {
    try {
        const { userId, userType } = req.params;
        const result = await userPreferenceService.getUserPreferences(userId, userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getPreferenceById = async (req, res, next) => {
    try {
        const result = await userPreferenceService.getPreferenceById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updatePreference = async (req, res, next) => {
    try {
        const result = await userPreferenceService.updatePreference(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deletePreference = async (req, res, next) => {
    try {
        const result = await userPreferenceService.deletePreference(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const checkPreference = async (req, res, next) => {
    try {
        const { userId, userType, categoryCode, channel } = req.query;
        const result = await userPreferenceService.checkUserPreference(userId, userType, categoryCode, channel);
        return successResponse(res, HTTP_CODES.OK, 'Preference check completed', result);
    } catch (error) {
        next(error);
    }
};

const generatePreferences = async (req, res, next) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);
        const result = await userPreferenceService.generatePreferences(userId);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPreference,
    getAllPreferences,
    getUserPreferences,
    getPreferenceById,
    updatePreference,
    deletePreference,
    checkPreference,
    generatePreferences,
};
