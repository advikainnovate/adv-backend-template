const { Op } = require('sequelize');
const db = require('../../database/models');
const { v4: uuidv4 } = require('uuid');

exports.profileRegister = async (payload) => {
    payload.id = uuidv4();
    const response = await db.UserProfileModel.create(payload);
    return response;
};

exports.updateProfile = async (userId, payload) => {
    const response = await db.UserProfileModel.update(payload, { where: { userId: userId, deletedAt: null } });
    return response;
};

exports.updatePassword = async (userId, payload) => {
    const response = await db.UserModel.update(payload, { where: { id: userId, deletedAt: null } });
    return response;
};

exports.findUserProfile = async (userId) => {
    try {
        const response = await db.UserProfileModel.findOne({ where: { userId: userId, deletedAt: null } });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findUser = async (userId) => {
    try {
        const response = await db.UserModel.findOne({ where: { id: userId, deletedAt: null } });
        console.log({ response });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findUserByEmail = async (email) => {
    try {
        const response = await db.UserModel.findOne({ where: { email: email } });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.findUserByUsername = async (username) => {
    try {
        const response = await db.UserModel.findOne({ where: { [Op.or]: [{ email: username }, { username: username }], deletedAt: null } });
        return response;
    } catch (error) {
        throw error;
    }
};

exports.sendOtp = async (payload) => {
    payload.id = uuidv4();
    const response = await db.OtpModel.create(payload);
    return response;
};

exports.verifyOtp = async (id) => {
    const response = await db.OtpModel.update({ verified: true }, { where: { id: id, deletedAt: null } });
    if (response[0] === 0) {
        throw new BadRequestException(MESSAGES.ERROR.BAD_REQUEST);
    }
    return response;
};

exports.findOtpWithUserIdAndCode = async (otpType, userId, otpCode) => {
    const response = await db.OtpModel.findOne({
        where: { otpType: otpType, userId: userId, otp: otpCode, verified: false, deletedAt: null },
    });
    return response;
};
