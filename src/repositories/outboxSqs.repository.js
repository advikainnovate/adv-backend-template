const { NotificationOutboxSQS } = require('../database/models');

const create = async (data) => {
    return await NotificationOutboxSQS.create(data);
};

const findById = async (id) => {
    return await NotificationOutboxSQS.findByPk(id);
};

const findOne = async (where) => {
    return await NotificationOutboxSQS.findOne({ where });
};

const findAll = async (where = {}, order = [['createdAt', 'ASC']], limit = 100) => {
    return await NotificationOutboxSQS.findAll({
        where,
        order,
        limit,
        include: ['notificationType', 'category', 'queue']
    });
};

const findPending = async (limit = 100) => {
    return await NotificationOutboxSQS.findAll({
        where: { status: 'PENDING' },
        order: [['createdAt', 'ASC']],
        limit,
        include: ['notificationType', 'category', 'queue']
    });
};

const update = async (outbox, data) => {
    return await outbox.update(data);
};

const destroy = async (outbox) => {
    return await outbox.destroy();
};

module.exports = {
    create,
    findById,
    findOne,
    findAll,
    findPending,
    update,
    destroy,
};
