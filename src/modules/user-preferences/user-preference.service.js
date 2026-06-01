const { userPreferenceRepository, rolePreferenceRepository, categoryRepository, channelRepository } = require('../../repositories');
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
    const existing = await userPreferenceRepository.findOne({
        userId: data.userId,
        userType: data.userType,
        categoryCode: data.categoryCode,
        channel: data.channel,
    });

    if (existing) {
        throw new BadRequestException('Preference for this user, category, and channel already exists');
    }

    const preference = await userPreferenceRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Preference created successfully', preference);
};

const getAllPreferences = async (query = {}) => {
    const preferences = await userPreferenceRepository.findAll(query);
    return serviceResponse(true, HTTP_CODES.OK, 'Preferences retrieved successfully', preferences);
};

const getUserPreferences = async (userId, userType) => {
    const preferences = await userPreferenceRepository.findByUser(userId, userType);
    return serviceResponse(true, HTTP_CODES.OK, 'User preferences retrieved successfully', preferences);
};

const getPreferenceById = async (id) => {
    const preference = await userPreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Preference not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Preference retrieved successfully', preference);
};

const updatePreference = async (id, data) => {
    const preference = await userPreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Preference not found');
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

    const updated = await userPreferenceRepository.update(preference, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Preference updated successfully', updated);
};

const deletePreference = async (id) => {
    const preference = await userPreferenceRepository.findById(id);
    if (!preference) {
        throw new NotFoundException('Preference not found');
    }

    await userPreferenceRepository.destroy(preference);
    return serviceResponse(true, HTTP_CODES.OK, 'Preference deleted successfully', null);
};

const checkUserPreference = async (userId, userType, categoryCode, channel) => {
    const preference = await userPreferenceRepository.findOne({
        userId,
        userType,
        categoryCode,
        channel,
    });

    // If no preference exists, look up role default preference
    if (!preference) {
        const roleDefault = await rolePreferenceRepository.findOne({
            userType,
            categoryCode,
            channel,
        });

        if (roleDefault) {
            return { isEnabled: roleDefault.isEnabled, preference: roleDefault };
        }

        // Default to disabled if no preference or default exists
        return { isEnabled: false, preference: null };
    }

    return { isEnabled: preference.isEnabled, preference };
};

const generatePreferences = async (userId) => {
    if (!userId) {
        throw new BadRequestException('User ID is required');
    }

    const db = require('../../database/models');
    const user = await db.UserModel.findOne({ where: { id: userId, deletedAt: null } });
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const userType = user.userType;

    const categories = await categoryRepository.findAll();
    const channels = await channelRepository.findAll();

    for (const category of categories) {
        for (const channel of channels) {
            const existing = await userPreferenceRepository.findOne({
                userId,
                userType,
                categoryCode: category.code,
                channel: channel.code,
            });

            if (!existing) {
                const roleDefault = await rolePreferenceRepository.findOne({
                    userType,
                    categoryCode: category.code,
                    channel: channel.code,
                });
                const isEnabled = roleDefault ? roleDefault.isEnabled : true;

                await userPreferenceRepository.create({
                    userId,
                    userType,
                    categoryCode: category.code,
                    channel: channel.code,
                    isEnabled,
                });
            }
        }
    }

    const preferences = await userPreferenceRepository.findByUser(userId, userType);
    return serviceResponse(true, HTTP_CODES.OK, 'User preferences generated successfully', preferences);
};

module.exports = {
    createPreference,
    getAllPreferences,
    getUserPreferences,
    getPreferenceById,
    updatePreference,
    deletePreference,
    checkUserPreference,
    generatePreferences,
};
