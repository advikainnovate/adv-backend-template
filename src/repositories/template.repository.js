const { NotificationTemplate } = require('../database/models');
const { paginate } = require('../utils/pagination');

const create = async (data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await NotificationTemplate.create(data);
};

const findById = async (id) => {
    return await NotificationTemplate.findByPk(id);
};

const findByCode = async (templateCode) => {
    return await NotificationTemplate.findOne({
        where: { templateCode },
        include: ['notificationType', 'category', 'notificationChannel']
    });
};

const findOne = async (where) => {
    if (where.channel) where.channel = where.channel.toUpperCase();
    return await NotificationTemplate.findOne({ where });
};

const findAll = async (query = {}) => {
    let { notificationTypeCode, categoryCode, channel, userType, isActive } = query;

    const where = {};
    if (notificationTypeCode) where.notificationTypeCode = notificationTypeCode;
    if (categoryCode) where.categoryCode = categoryCode;
    if (channel) where.channel = channel.toUpperCase();
    if (userType) where.userType = userType;
    if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
    }

    return await paginate(NotificationTemplate, {
        where,
        order: [['templateCode', 'ASC']],
        include: ['notificationType', 'category', 'notificationChannel']
    }, query);
};

const update = async (template, data) => {
    if (data.channel) data.channel = data.channel.toUpperCase();
    return await template.update(data);
};

const destroy = async (template) => {
    return await template.destroy();
};

const findActiveChannels = async (notificationTypeCode, categoryCode, userType) => {
    const templates = await NotificationTemplate.findAll({
        where: {
            notificationTypeCode,
            categoryCode,
            userType,
            isActive: true,
        },
        attributes: ['channel'],
    });
    return [...new Set(templates.map((t) => t.channel))];
};

module.exports = {
    create,
    findById,
    findByCode,
    findOne,
    findAll,
    update,
    destroy,
    findActiveChannels,
};
