const { typeRepository, categoryRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createType = async (data) => {
    // Validate category exists
    const category = await categoryRepository.findByCode(data.categoryCode);
    if (!category) {
        throw new BadRequestException(`Notification category with code '${data.categoryCode}' not found`);
    }

    let generatedCode = data.code;
    if (!generatedCode && data.name) {
        generatedCode = data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        if (!generatedCode) {
            generatedCode = 'type';
        }

        let finalCode = generatedCode;
        let suffix = 2;
        while (true) {
            const existing = await typeRepository.findByCode(finalCode);
            if (!existing) {
                break;
            }
            finalCode = `${generatedCode}_${suffix}`;
            suffix++;
        }
        data.code = finalCode;
    }

    const existing = await typeRepository.findByCode(data.code);
    if (existing) {
        throw new BadRequestException(`Notification type with code '${data.code}' already exists`);
    }

    const type = await typeRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Notification type created successfully', type);
};

const getAllTypes = async (filters = {}) => {
    const where = {};

    if (filters.categoryCode) {
        where.categoryCode = filters.categoryCode;
    }
    if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
    }
    if (filters.priority) {
        where.priority = filters.priority;
    }

    const types = await typeRepository.findAll(where);
    return serviceResponse(true, HTTP_CODES.OK, 'Notification types retrieved successfully', types);
};

const getTypeById = async (id) => {
    const type = await typeRepository.findById(id);
    if (!type) {
        throw new NotFoundException('Notification type not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Notification type retrieved successfully', type);
};

const getTypeByCode = async (code) => {
    const type = await typeRepository.findByCode(code);
    if (!type) {
        throw new NotFoundException('Notification type not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Notification type retrieved successfully', type);
};

const updateType = async (id, data) => {
    const type = await typeRepository.findById(id);
    if (!type) {
        throw new NotFoundException('Notification type not found');
    }

    // Validate category if being changed
    if (data.categoryCode && data.categoryCode !== type.categoryCode) {
        const category = await categoryRepository.findByCode(data.categoryCode);
        if (!category) {
            throw new BadRequestException(`Category with code '${data.categoryCode}' not found`);
        }
    }

    // Check if code is being changed and if it conflicts
    if (data.code && data.code !== type.code) {
        const existing = await typeRepository.findByCode(data.code);
        if (existing) {
            throw new BadRequestException(`Notification type with code '${data.code}' already exists`);
        }
    }

    const updated = await typeRepository.update(type, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Notification type updated successfully', updated);
};

const deleteType = async (id) => {
    const type = await typeRepository.findById(id);
    if (!type) {
        throw new NotFoundException('Notification type not found');
    }

    await typeRepository.destroy(type);
    return serviceResponse(true, HTTP_CODES.OK, 'Notification type deleted successfully', null);
};

module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    getTypeByCode,
    updateType,
    deleteType,
};
