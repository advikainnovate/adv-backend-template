const { NotificationChannel } = require('../database/models');

const create = async (data) => {
    return await NotificationChannel.create(data);
};

const findById = async (id) => {
    return await NotificationChannel.findByPk(id);
};

const findByCode = async (code) => {
    return await NotificationChannel.findOne({ where: { code } });
};

const findOne = async (where) => {
    return await NotificationChannel.findOne({ where });
};

const findAll = async (where = {}, order = [['name', 'ASC']]) => {
    return await NotificationChannel.findAll({
        where,
        order
    });
};

const update = async (channel, data) => {
    return await channel.update(data);
};

const destroy = async (channel) => {
    return await channel.destroy();
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
