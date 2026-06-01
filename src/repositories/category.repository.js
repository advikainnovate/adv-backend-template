const { NotificationCategory } = require('../database/models');
const { paginate } = require('../utils/pagination');

const create = async (data) => {
    return await NotificationCategory.create(data);
};

const findById = async (id) => {
    return await NotificationCategory.findByPk(id);
};

const findByCode = async (code) => {
    return await NotificationCategory.findOne({ where: { code } });
};

const findOne = async (where) => {
    return await NotificationCategory.findOne({ where });
};

const findAll = async (query = {}) => {
    let { isActive } = query;

    const where = {};
    if (isActive !== undefined) {
        where.isActive = isActive === 'true' || isActive === true;
    }

    return await paginate(NotificationCategory, {
        where,
        order: [['name', 'ASC']]
    }, query);
};

const update = async (category, data) => {
    return await category.update(data);
};

const destroy = async (category) => {
    return await category.destroy();
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
