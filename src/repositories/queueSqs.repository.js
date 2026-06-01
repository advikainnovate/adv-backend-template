const { NotificationQueueSQS } = require('../database/models');

const create = async (data) => {
    return await NotificationQueueSQS.create(data);
};

const findById = async (id) => {
    return await NotificationQueueSQS.findByPk(id);
};

const findByCode = async (queueCode) => {
    return await NotificationQueueSQS.findOne({ where: { queueCode } });
};

const findOne = async (where) => {
    return await NotificationQueueSQS.findOne({ where });
};

const findAll = async (where = {}, order = [['priority', 'DESC']]) => {
    return await NotificationQueueSQS.findAll({
        where,
        order
    });
};

const update = async (queue, data) => {
    return await queue.update(data);
};

const destroy = async (queue) => {
    return await queue.destroy();
};

module.exports = {
    create,
    findById,
    findByCode,
    findOne,
    findAll,
    update,
    destroy,
};
