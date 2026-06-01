const { UserNotificationPreference } = require('../database/models');
const { paginate } = require('../utils/pagination');

const create = async (data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await UserNotificationPreference.create(data);
};

const findById = async (id) => {
    return await UserNotificationPreference.findByPk(id);
};

const findOne = async (where) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await UserNotificationPreference.findOne({ where });
};

const findAll = async (query = {}) => {
    let { userId, userType, categoryCode, channel, isEnabled } = query;

    const where = {};
    if (userId) where.userId = userId;
    if (userType) where.userType = userType;
    if (categoryCode) where.categoryCode = categoryCode;
    if (channel) where.channel = channel.toUpperCase();
    if (isEnabled !== undefined) {
        where.isEnabled = isEnabled === 'true' || isEnabled === true;
    }

    return await paginate(UserNotificationPreference, {
        where,
        order: [['createdAt', 'DESC']],
        include: ['category', 'notificationChannel']
    }, query);
};

const findByUser = async (userId, userType) => {
    return await UserNotificationPreference.findAll({
        where: { userId, userType },
        include: ['category', 'notificationChannel']
    });
};

const update = async (preference, data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await preference.update(data);
};

const destroy = async (preference) => {
    return await preference.destroy();
};

module.exports = {
    create,
    findById,
    findOne,
    findAll,
    findByUser,
    update,
    destroy,
};
