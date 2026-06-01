const { templateRepository, typeRepository, categoryRepository, channelRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createTemplate = async (data) => {
    // Validate notification type exists
    const type = await typeRepository.findByCode(data.notificationTypeCode);
    if (!type) {
        throw new BadRequestException(`Notification type with code '${data.notificationTypeCode}' not found`);
    }

    // Validate category exists
    const category = await categoryRepository.findByCode(data.categoryCode);
    if (!category) {
        throw new BadRequestException(`Category with code '${data.categoryCode}' not found`);
    }

    // Validate channel exists
    const channel = await channelRepository.findByCode(data.channel);
    if (!channel) {
        throw new BadRequestException(`Channel with code '${data.channel}' not found`);
    }

    const existing = await templateRepository.findByCode(data.templateCode);
    if (existing) {
        throw new BadRequestException(`Template with code '${data.templateCode}' already exists`);
    }

    const template = await templateRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Template created successfully', template);
};

const getAllTemplates = async (query = {}) => {
    const templates = await templateRepository.findAll(query);
    return serviceResponse(true, HTTP_CODES.OK, 'Templates retrieved successfully', templates);
};

const getTemplateById = async (id) => {
    const template = await templateRepository.findById(id);
    if (!template) {
        throw new NotFoundException('Template not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Template retrieved successfully', template);
};

const getTemplateByCode = async (templateCode) => {
    const template = await templateRepository.findByCode(templateCode);
    if (!template) {
        throw new NotFoundException('Template not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Template retrieved successfully', template);
};

const updateTemplate = async (id, data) => {
    const template = await templateRepository.findById(id);
    if (!template) {
        throw new NotFoundException('Template not found');
    }

    // Validate notification type if being changed
    if (data.notificationTypeCode && data.notificationTypeCode !== template.notificationTypeCode) {
        const type = await typeRepository.findByCode(data.notificationTypeCode);
        if (!type) {
            throw new BadRequestException(`Notification type with code '${data.notificationTypeCode}' not found`);
        }
    }

    // Validate category if being changed
    if (data.categoryCode && data.categoryCode !== template.categoryCode) {
        const category = await categoryRepository.findByCode(data.categoryCode);
        if (!category) {
            throw new BadRequestException(`Category with code '${data.categoryCode}' not found`);
        }
    }

    // Validate channel if being changed
    if (data.channel && data.channel !== template.channel) {
        const channel = await channelRepository.findByCode(data.channel);
        if (!channel) {
            throw new BadRequestException(`Channel with code '${data.channel}' not found`);
        }
    }

    // Check if template code is being changed and if it conflicts
    if (data.templateCode && data.templateCode !== template.templateCode) {
        const existing = await templateRepository.findByCode(data.templateCode);
        if (existing) {
            throw new BadRequestException(`Template with code '${data.templateCode}' already exists`);
        }
    }

    const updated = await templateRepository.update(template, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Template updated successfully', updated);
};

const deleteTemplate = async (id) => {
    const template = await templateRepository.findById(id);
    if (!template) {
        throw new NotFoundException('Template not found');
    }

    await templateRepository.destroy(template);
    return serviceResponse(true, HTTP_CODES.OK, 'Template deleted successfully', null);
};

module.exports = {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    getTemplateByCode,
    updateTemplate,
    deleteTemplate,
};
