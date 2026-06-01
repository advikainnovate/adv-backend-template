const { rolePreferenceRepository, categoryRepository, channelRepository } = require('../../repositories');
const { RoleNotificationPreference, sequelize } = require('../../database/models');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createPreference = async (data) => {
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

    // Check if preference already exists
    const existing = await rolePreferenceRepository.findOne({
        userType: data.userType,
        categoryCode: data.categoryCode,
        channel: data.channel,
    });

    if (existing) {
        throw new BadRequestException('Default preference for this role, category, and channel already exists');
    }

    const preference = await rolePreferenceRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Role default preference created successfully', preference);
};

const getAllPreferences = async (query = {}) => {
    const preferences = await rolePreferenceRepository.findAll(query);
    return serviceResponse(true, HTTP_CODES.OK, 'Role default preferences retrieved successfully', preferences);
};

const getRolePreferences = async (userType) => {
    const preferences = await rolePreferenceRepository.findByRole(userType);
    return serviceResponse(true, HTTP_CODES.OK, 'Role preferences retrieved successfully', preferences);
};

const getPreferenceById = async (id) => {
    const preference = await rolePreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Role preference not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Role preference retrieved successfully', preference);
};

const updatePreference = async (id, data) => {
    const preference = await rolePreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Role preference not found');
    }

    // Validate category if being changed
    if (data.categoryCode && data.categoryCode !== preference.categoryCode) {
        const category = await categoryRepository.findByCode(data.categoryCode);
        if (!category) {
            throw new BadRequestException(`Category with code '${data.categoryCode}' not found`);
        }
    }

    // Validate channel if being changed
    if (data.channel && data.channel !== preference.channel) {
        const channel = await channelRepository.findByCode(data.channel);
        if (!channel) {
            throw new BadRequestException(`Channel with code '${data.channel}' not found`);
        }
    }

    // If changing fields, ensure uniqueness is not violated
    if ((data.userType && data.userType !== preference.userType) ||
        (data.categoryCode && data.categoryCode !== preference.categoryCode) ||
        (data.channel && data.channel !== preference.channel)) {
        const existing = await rolePreferenceRepository.findOne({
            userType: data.userType || preference.userType,
            categoryCode: data.categoryCode || preference.categoryCode,
            channel: data.channel || preference.channel,
        });
        if (existing && existing.id !== id) {
            throw new BadRequestException('Default preference for this role, category, and channel already exists');
        }
    }

    const updated = await rolePreferenceRepository.update(preference, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Role preference updated successfully', updated);
};

const deletePreference = async (id) => {
    const preference = await rolePreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Role preference not found');
    }

    await rolePreferenceRepository.destroy(preference);
    return serviceResponse(true, HTTP_CODES.OK, 'Role preference deleted successfully', null);
};

const bulkCreatePreferences = async ({ userTypes, channels, isEnabled }) => {
    // 1. Fetch all category codes
    const categories = await categoryRepository.findAll();
    const categoryCodes = categories.map(cat => cat.code);

    if (categoryCodes.length === 0) {
        throw new BadRequestException('No notification categories found in the system to initialize defaults.');
    }

    // 2. Build the array of records to create/update
    const recordsToUpsert = [];
    for (const userType of userTypes) {
        for (const channel of channels) {
            for (const categoryCode of categoryCodes) {
                recordsToUpsert.push({
                    userType,
                    categoryCode,
                    channel,
                    isEnabled,
                });
            }
        }
    }

    // 3. Perform bulk upsert in a single query/transaction
    const t = await sequelize.transaction();
    try {
        const result = await RoleNotificationPreference.bulkCreate(recordsToUpsert, {
            updateOnDuplicate: ['isEnabled'],
            transaction: t,
        });

        await t.commit();

        return serviceResponse(true, HTTP_CODES.OK, 'Bulk role preferences initialized/updated successfully', {
            totalProcessed: result.length,
        });

    } catch (error) {
        await t.rollback();
        throw error;
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
