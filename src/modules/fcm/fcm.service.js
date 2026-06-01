const { userDeviceTokenRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException } = require('../../helpers/errorResponse');

const registerToken = async (data) => {
    const token = await userDeviceTokenRepository.register(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'FCM device token registered successfully', token);
};

const getAllTokens = async (query = {}) => {
    const tokens = await userDeviceTokenRepository.findAll(query);
    return serviceResponse(true, HTTP_CODES.OK, 'FCM device tokens retrieved successfully', tokens);
};

const getTokenById = async (id) => {
    const token = await userDeviceTokenRepository.findById(id);
    if (!token) {
        throw new NotFoundException('FCM device token not found');
    }
    return serviceResponse(true, HTTP_CODES.OK, 'FCM device token retrieved successfully', token);
};

const getActiveTokenByUserId = async (userId, userType = null) => {
    const token = await userDeviceTokenRepository.findActiveTokenByUser(userId, userType);
    if (!token) {
        throw new NotFoundException('Active FCM device token not found for user');
    }
    return serviceResponse(true, HTTP_CODES.OK, 'Active FCM device token retrieved successfully', token);
};

const unregisterTokens = async (userId, userType) => {
    await userDeviceTokenRepository.deleteByUser(userId, userType);
    return serviceResponse(true, HTTP_CODES.OK, 'FCM device tokens unregistered successfully', null);
};

module.exports = {
    registerToken,
    getAllTokens,
    getTokenById,
    getActiveTokenByUserId,
    unregisterTokens,
};
