const { HTTP_CODES, MESSAGES } = require('../../config');
const { serviceResponse, NotFoundException, BadRequestException } = require('../../helpers');
const { bcrypt, jwt } = require('../../utils');
const userRepository = require('./user.repository');

exports.register = async (payload) => {
    try {
        const user = await userRepository.findUserByEmail(payload.email);
        if (user) {
            throw new BadRequestException(MESSAGES.ERROR.EMAIL_ALREADY_EXIST);
        }
        payload.username = payload.email;
        payload.display_name = payload.display_name || payload.username;
        payload.gender = payload.gender.toLowerCase();
        payload.status = 'active';
        payload.password = await bcrypt.generatePassword(payload.password);
        const response = await userRepository.register(payload);

        const jwtPayload = {
            id: response.id,
            email: response.email,
            role: response.userType,
        };

        const accessToken = jwt.generateAccessToken(jwtPayload);
        const refreshToken = jwt.generateRefreshToken(jwtPayload);

        return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.CREATED, {
            id: response.id,
            idd: response.idd,
            userType: response.userType,
            username: response.username,
            display_name: response.display_name,
            email: response.email,
            countryCode: response.countryCode,
            phoneNumber: response.phoneNumber,
            gender: response.gender,
            status: response.status,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

exports.profile = async (userId) => {
    const response = await userRepository.findUser(userId);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.checkDisplayName = async (payload) => {
    const response = await userRepository.checkDisplayName(payload);
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.getDashboard = async (query) => {
    const response = await userRepository.getDashboard(query);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.getAllUsers = async (query) => {
    const response = await userRepository.getAllUsers(query);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.getAllUserDropdown = async (query) => {
    const response = await userRepository.getAllUserDropdown(query);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.findUser = async (userId) => {
    const response = await userRepository.findUser(userId);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.changePassword = async (id, payload) => {
    const response = await userRepository.changePassword(id, payload);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.updateUser = async (id, payload) => {
    const response = await userRepository.update(id, payload);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};

exports.deleteUser = async (id) => {
    const response = await userRepository.delete(id);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.OK, response);
};
