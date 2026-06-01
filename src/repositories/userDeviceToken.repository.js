const { UserDeviceToken } = require('../database/models');
const { paginate } = require('../utils/pagination');

const findById = async (id) => {
    return await UserDeviceToken.findByPk(id);
};

const findOne = async (where) => {
    return await UserDeviceToken.findOne({ where });
};

const findAll = async (query = {}) => {
    const { userId, userType, isActive, platform } = query;
    const where = {};
    if (userId) where.userId = userId;
    if (userType) where.userType = userType;
    if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
    }
    if (platform) where.platform = platform;

    return await paginate(UserDeviceToken, {
        where,
        order: [['createdAt', 'DESC']],
    }, query);
};

const findActiveTokenByUser = async (userId, userType = null) => {
    const where = { userId, isActive: true };
    if (userType) {
        where.userType = userType;
    }
    return await UserDeviceToken.findOne({
        where,
        order: [['updatedAt', 'DESC']],
    });
};

/**
 * Hard delete a device token record
 */
const hardDestroy = async (tokenInstance) => {
    return await tokenInstance.destroy({ force: true });
};

/**
 * Delete all device tokens associated with a user
 */
const deleteByUser = async (userId, userType) => {
    return await UserDeviceToken.destroy({
        where: { userId, userType },
        force: true,
    });
};

/**
 * Register or update a device token
 */
const register = async (data) => {
    const { userId, userType, deviceToken, platform } = data;

    // Search for the token even if it was soft deleted
    const existingToken = await UserDeviceToken.findOne({
        where: { deviceToken },
        paranoid: false,
    });

    if (existingToken) {
        // Hard delete the old token record to prevent unique constraints issues
        await hardDestroy(existingToken);
    }

    return await UserDeviceToken.create({
        userId,
        userType,
        deviceToken,
        platform,
        isActive: true,
    });
};

module.exports = {
    findById,
    findOne,
    findAll,
    hardDestroy,
    register,
    findActiveTokenByUser,
    deleteByUser,
};
