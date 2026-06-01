const { NotificationDeliveryAttempt } = require('../database/models');

const create = async (data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await NotificationDeliveryAttempt.create(data);
};

const findById = async (id) => {
    return await NotificationDeliveryAttempt.findByPk(id);
};

const findOne = async (where) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await NotificationDeliveryAttempt.findOne({ where });
};

const findAll = async (where = {}, order = [['attemptedAt', 'DESC']]) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await NotificationDeliveryAttempt.findAll({
        where,
        order,
        include: ['notification']
    });
};

const findByNotificationId = async (notificationId) => {
    return await NotificationDeliveryAttempt.findAll({
        where: { notificationId },
        order: [['attemptNo', 'ASC']]
    });
};

module.exports = {
    create,
    findById,
    findOne,
    findAll,
    findByNotificationId,
};
