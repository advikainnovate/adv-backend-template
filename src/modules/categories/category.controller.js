const categoryService = require('./category.service');
const { successResponse } = require('../../helpers/response');

const createCategory = async (req, res, next) => {
    try {
        const result = await categoryService.createCategory(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getAllCategories(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const result = await categoryService.getCategoryById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getCategoryByCode = async (req, res, next) => {
    try {
        const result = await categoryService.getCategoryByCode(req.params.code);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const result = await categoryService.updateCategory(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryByCode,
    updateCategory,
    deleteCategory,
};
