const { Notification } = require('../database/models');
const { paginate } = require('../utils/pagination');

const create = async (data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await Notification.create(data);
};

const findById = async (id) => {
    return await Notification.findByPk(id, {
        include: ['notificationType', 'notificationChannel', 'deliveryAttempts']
    });
};

const findOne = async (where) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await Notification.findOne({ where });
};

const findAll = async (query = {}) => {
    let { userId, userType, notificationTypeCode, categoryCode, channel, status, isRead } = query;

    const where = {};
    if (userId) where.userId = userId;
    if (userType) where.userType = userType;
    if (notificationTypeCode) where.notificationTypeCode = notificationTypeCode;
    if (categoryCode) where.categoryCode = categoryCode;
    if (channel) where.channel = channel.toUpperCase();
    if (status) where.status = status;
    if (isRead !== undefined) {
        where.isRead = isRead === 'true' || isRead === true;
    }

    return await paginate(Notification, {
        where,
        order: [['createdAt', 'DESC']],
        include: ['notificationType', 'notificationChannel']
    }, query);
};

const update = async (notification, data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await notification.update(data);
};

const updateMany = async (where, data) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await Notification.update(data, { where });
};

const count = async (where = {}) => {
    return await Notification.count({ where });
};

const destroy = async (notification) => {
    return await notification.destroy();
};

module.exports = {
    create,
    findById,
    findOne,
    findAll,
    update,
    updateMany,
    count,
    destroy,
};
