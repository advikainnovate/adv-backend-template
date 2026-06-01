const notificationTypeService = require('./notification-type.service');
const { successResponse } = require('../../helpers/response');

const createType = async (req, res, next) => {
    try {
        const result = await notificationTypeService.createType(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllTypes = async (req, res, next) => {
    try {
        const filters = {
            categoryCode: req.query.categoryCode,
            priority: req.query.priority,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        };
        const result = await notificationTypeService.getAllTypes(filters);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getTypeById = async (req, res, next) => {
    try {
        const result = await notificationTypeService.getTypeById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getTypeByCode = async (req, res, next) => {
    try {
        const result = await notificationTypeService.getTypeByCode(req.params.code);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updateType = async (req, res, next) => {
    try {
        const result = await notificationTypeService.updateType(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deleteType = async (req, res, next) => {
    try {
        const result = await notificationTypeService.deleteType(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    getTypeByCode,
    updateType,
    deleteType,
};
