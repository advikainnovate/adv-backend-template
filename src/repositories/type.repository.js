const { NotificationType } = require('../database/models');

const create = async (data) => {
    return await NotificationType.create(data);
};

const findById = async (id) => {
    return await NotificationType.findByPk(id);
};

const findByCode = async (code) => {
    return await NotificationType.findOne({
        where: { code },
        include: ['category']
    });
};

const findOne = async (where) => {
    return await NotificationType.findOne({ where });
};

const findAll = async (where = {}, order = [['name', 'ASC']]) => {
    return await NotificationType.findAll({
        where,
        order,
        include: ['category']
    });
};

const update = async (type, data) => {
    return await type.update(data);
};

const destroy = async (type) => {
    return await type.destroy();
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
