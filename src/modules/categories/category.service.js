const { categoryRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createCategory = async (data) => {
    let generatedCode = data.code;
    if (!generatedCode && data.name) {
        generatedCode = data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        if (!generatedCode) {
            generatedCode = 'category';
        }

        let finalCode = generatedCode;
        let suffix = 2;
        while (true) {
            const existing = await categoryRepository.findByCode(finalCode);
            if (!existing) {
                break;
            }
            finalCode = `${generatedCode}_${suffix}`;
            suffix++;
        }
        data.code = finalCode;
    }

    const existing = await categoryRepository.findByCode(data.code);
    if (existing) {
        throw new BadRequestException(`Category with code '${data.code}' already exists`);
    }

    const category = await categoryRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Category created successfully', category);
};

const getAllCategories = async (query = {}) => {
    const categories = await categoryRepository.findAll(query);
    return serviceResponse(true, HTTP_CODES.OK, 'Categories retrieved successfully', categories);
};

const getCategoryById = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
        throw new NotFoundException('Category not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Category retrieved successfully', category);
};

const getCategoryByCode = async (code) => {
    const category = await categoryRepository.findByCode(code);
    if (!category) {
        throw new NotFoundException('Category not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Category retrieved successfully', category);
};

const updateCategory = async (id, data) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
        throw new NotFoundException('Category not found');
    }

    // Check if code is being changed and if it conflicts
    if (data.code && data.code !== category.code) {
        const existing = await categoryRepository.findByCode(data.code);
        if (existing) {
            throw new BadRequestException(`Category with code '${data.code}' already exists`);
        }
    }

    const updated = await categoryRepository.update(category, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Category updated successfully', updated);
};

const deleteCategory = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
        throw new NotFoundException('Category not found');
    }

    await categoryRepository.destroy(category);
    return serviceResponse(true, HTTP_CODES.OK, 'Category deleted successfully', null);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    getCategoryByCode,
    updateCategory,
    deleteCategory,
};
