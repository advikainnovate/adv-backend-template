const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../../config');
const { serviceResponse, NotFoundException, BadRequestException } = require('../../helpers');
const { bcrypt, jwt, generateOtp, dateUtil } = require('../../utils');
const authRepository = require('./auth.repository');

exports.login = async (payload) => {
    const response = await authRepository.findUserByUsername(payload.username);
    if (!response) {
        throw new NotFoundException(MESSAGES.ERROR.USER_NOT_EXIST);
    }

    const isMatch = await bcrypt.verifyPassword(payload.password, response.password);

    if (!isMatch) {
        throw new NotFoundException(MESSAGES.ERROR.INVALID_USER);
    }

    if (response.status !== CONSTANTS.USER_STATUS.ACTIVE) {
        throw new NotFoundException(MESSAGES.ERROR.INACTIVE_USER);
    }

    const jwtPayload = {
        id: response.id,
        email: response.email,
        role: response.userType,
    };

    const accessToken = jwt.generateAccessToken(jwtPayload);
    const refreshToken = jwt.generateRefreshToken(jwtPayload);

    return serviceResponse(true, HTTP_CODES.OK, MESSAGES.SUCCESS.LOGIN, {
        id: response.id,
        email: response.email,
        role: response.userType,
        accessToken,
        refreshToken,
    });
};

exports.findUser = async (userId) => {
    const response = await authRepository.findUser(userId);
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.CREATED, response);
};

exports.forgetPassword = async (payload) => {
    const user = await authRepository.findUserByEmail(payload.email);
    if (!user) {
        throw new BadRequestException(MESSAGES.ERROR.USER_NOT_EXIST);
    }
    const otpCode = generateOtp();
    let options = {};
    options.userId = user.id;
    options.otpType = 'email';
    options.otp = otpCode;
    options.expiresAt = dateUtil.after10MinutesTime();

    await authRepository.sendOtp(options);

    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.SENT_OTP_EMAIL);
};

exports.resetPassword = async (payload) => {
    const user = await authRepository.findUserByEmail(payload.email);
    if (!user) {
        throw new BadRequestException(MESSAGES.ERROR.USER_NOT_EXIST);
    }

    const response = await authRepository.findOtpWithUserIdAndCode('email', user.id, payload.otp);
    if (!response) {
        throw new BadRequestException(MESSAGES.ERROR.INVALID_OTP);
    }

    await authRepository.verifyOtp(response.id);

    const samePassword = await bcrypt.verifyPassword(payload.newPassword, user.password);

    console.log({ samePassword });

    // Check if Password same as old
    if (samePassword) {
        throw new BadRequestException(MESSAGES.ERROR.NOT_SAME_PASS);
    }

    // Generate new password hash
    const newHashPassword = await bcrypt.generatePassword(payload.newPassword);

    // Update User new Password
    await authRepository.updatePassword(user.id, { password: newHashPassword });

    return serviceResponse(true, HTTP_CODES.OK, MESSAGES.SUCCESS.RESET_PASSWORD);
};

exports.logoutUser = async (userId) => {
    return serviceResponse(true, HTTP_CODES.CREATED, MESSAGES.SUCCESS.LOGOUT);
};


