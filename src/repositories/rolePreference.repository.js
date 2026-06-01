const { RoleNotificationPreference } = require('../database/models');
const { paginate } = require('../utils/pagination');

const create = async (data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await RoleNotificationPreference.create(data);
};

const findById = async (id) => {
    return await RoleNotificationPreference.findByPk(id);
};

const findOne = async (where) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await RoleNotificationPreference.findOne({ where });
};

const findAll = async (query = {}) => {
    let { userType, categoryCode, channel, isEnabled } = query;

    const where = {};
    if (userType) where.userType = userType;
    if (categoryCode) where.categoryCode = categoryCode;
    if (channel) where.channel = channel.toUpperCase();
    if (isEnabled !== undefined) {
        where.isEnabled = isEnabled === 'true' || isEnabled === true;
    }

    return await paginate(RoleNotificationPreference, {
        where,
        order: [['createdAt', 'DESC']],
        include: ['category', 'notificationChannel']
    }, query);
};

const findByRole = async (userType) => {
    return await RoleNotificationPreference.findAll({
        where: { userType },
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
    findByRole,
    update,
    destroy,
};
