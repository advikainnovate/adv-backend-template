const rolePreferenceService = require('./role-preference.service');
const { successResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');

const createPreference = async (req, res, next) => {
    try {
        const result = await rolePreferenceService.createPreference(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllPreferences = async (req, res, next) => {
    try {
        const result = await rolePreferenceService.getAllPreferences(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getRolePreferences = async (req, res, next) => {
    try {
        const { userType } = req.params;
        const result = await rolePreferenceService.getRolePreferences(userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getPreferenceById = async (req, res, next) => {
    try {
        const result = await rolePreferenceService.getPreferenceById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updatePreference = async (req, res, next) => {
    try {
        const result = await rolePreferenceService.updatePreference(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deletePreference = async (req, res, next) => {
    try {
        const result = await rolePreferenceService.deletePreference(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const bulkCreatePreferences = async (req, res, next) => {
    try {
        const { userTypes, channels, isEnabled } = req.body;
        const result = await rolePreferenceService.bulkCreatePreferences({ userTypes, channels, isEnabled });
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPreference,
    getAllPreferences,
    getRolePreferences,
    getPreferenceById,
    updatePreference,
    deletePreference,
    bulkCreatePreferences,
};
