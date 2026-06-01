const templateService = require('./template.service');
const { successResponse } = require('../../helpers/response');

const createTemplate = async (req, res, next) => {
    try {
        const result = await templateService.createTemplate(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllTemplates = async (req, res, next) => {
    try {
        const result = await templateService.getAllTemplates(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getTemplateById = async (req, res, next) => {
    try {
        const result = await templateService.getTemplateById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getTemplateByCode = async (req, res, next) => {
    try {
        const result = await templateService.getTemplateByCode(req.params.code);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updateTemplate = async (req, res, next) => {
    try {
        const result = await templateService.updateTemplate(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deleteTemplate = async (req, res, next) => {
    try {
        const result = await templateService.deleteTemplate(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    getTemplateByCode,
    updateTemplate,
    deleteTemplate,
};
