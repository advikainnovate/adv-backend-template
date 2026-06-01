const { channelRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createChannel = async (data) => {
    let generatedCode = data.code;
    if (!generatedCode && data.name) {
        generatedCode = data.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        if (!generatedCode) {
            generatedCode = 'channel';
        }

        let finalCode = generatedCode;
        let suffix = 2;
        while (true) {
            const existing = await channelRepository.findByCode(finalCode);
            if (!existing) {
                break;
            }
            finalCode = `${generatedCode}_${suffix}`;
            suffix++;
        }
        data.code = finalCode;
    }

    const existing = await channelRepository.findByCode(data.code);
    if (existing) {
        throw new BadRequestException(`Channel with code '${data.code}' already exists`);
    }

    const channel = await channelRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Channel created successfully', channel);
};

const getAllChannels = async (filters = {}) => {
    const where = {};

    if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
    }

    const channels = await channelRepository.findAll(where);
    return serviceResponse(true, HTTP_CODES.OK, 'Channels retrieved successfully', channels);
};

const getChannelById = async (id) => {
    const channel = await channelRepository.findById(id);
    if (!channel) {
        throw new NotFoundException('Channel not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Channel retrieved successfully', channel);
};

const getChannelByCode = async (code) => {
    const channel = await channelRepository.findByCode(code);
    if (!channel) {
        throw new NotFoundException('Channel not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Channel retrieved successfully', channel);
};

const updateChannel = async (id, data) => {
    const channel = await channelRepository.findById(id);
    if (!channel) {
        throw new NotFoundException('Channel not found');
    }

    // Check if code is being changed and if it conflicts
    if (data.code && data.code !== channel.code) {
        const existing = await channelRepository.findByCode(data.code);
        if (existing) {
            throw new BadRequestException(`Channel with code '${data.code}' already exists`);
        }
    }

    const updated = await channelRepository.update(channel, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Channel updated successfully', updated);
};

const deleteChannel = async (id) => {
    const channel = await channelRepository.findById(id);
    if (!channel) {
        throw new NotFoundException('Channel not found');
    }

    await channelRepository.destroy(channel);
    return serviceResponse(true, HTTP_CODES.OK, 'Channel deleted successfully', null);
};

module.exports = {
    createChannel,
    getAllChannels,
    getChannelById,
    getChannelByCode,
    updateChannel,
    deleteChannel,
};
