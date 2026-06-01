const channelService = require('./channel.service');
const { successResponse } = require('../../helpers/response');

const createChannel = async (req, res, next) => {
    try {
        const result = await channelService.createChannel(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllChannels = async (req, res, next) => {
    try {
        const filters = {
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        };
        const result = await channelService.getAllChannels(filters);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getChannelById = async (req, res, next) => {
    try {
        const result = await channelService.getChannelById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getChannelByCode = async (req, res, next) => {
    try {
        const result = await channelService.getChannelByCode(req.params.code);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updateChannel = async (req, res, next) => {
    try {
        const result = await channelService.updateChannel(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deleteChannel = async (req, res, next) => {
    try {
        const result = await channelService.deleteChannel(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createChannel,
    getAllChannels,
    getChannelById,
    getChannelByCode,
    updateChannel,
    deleteChannel,
};
