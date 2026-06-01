const { NotificationWorkerLockSQS } = require('../database/models');

const create = async (data) => {
    return await NotificationWorkerLockSQS.create(data);
};

const findById = async (id) => {
    return await NotificationWorkerLockSQS.findByPk(id);
};

const findOne = async (where) => {
    return await NotificationWorkerLockSQS.findOne({ where });
};

const findAll = async (where = {}, order = [['lockedAt', 'DESC']]) => {
    return await NotificationWorkerLockSQS.findAll({
        where,
        order,
        include: ['queue']
    });
};

const findByQueueCode = async (queueCode) => {
    return await NotificationWorkerLockSQS.findOne({
        where: { queueCode },
        include: ['queue']
    });
};

const destroy = async (lock) => {
    return await lock.destroy();
};

module.exports = {
    create,
    findById,
    findOne,
    findAll,
    findByQueueCode,
    destroy,
};
