const { queueSqsRepository } = require('../../repositories');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

const createQueue = async (data) => {
    const existing = await queueSqsRepository.findByCode(data.queueCode);
    if (existing) {
        throw new BadRequestException(`Queue with code '${data.queueCode}' already exists`);
    }

    const queue = await queueSqsRepository.create(data);
    return serviceResponse(true, HTTP_CODES.CREATED, 'Queue created successfully', queue);
};

const getAllQueues = async (filters = {}) => {
    const where = {};

    if (filters.priority) {
        where.priority = filters.priority;
    }

    const queues = await queueSqsRepository.findAll(where);
    return serviceResponse(true, HTTP_CODES.OK, 'Queues retrieved successfully', queues);
};

const getQueueById = async (id) => {
    const queue = await queueSqsRepository.findById(id);
    if (!queue) {
        throw new NotFoundException('Queue not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Queue retrieved successfully', queue);
};

const getQueueByCode = async (code) => {
    const queue = await queueSqsRepository.findByCode(code);
    if (!queue) {
        throw new NotFoundException('Queue not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Queue retrieved successfully', queue);
};

const updateQueue = async (id, data) => {
    const queue = await queueSqsRepository.findById(id);
    if (!queue) {
        throw new NotFoundException('Queue not found');
    }

    // Check if code is being changed and if it conflicts
    if (data.queueCode && data.queueCode !== queue.queueCode) {
        const existing = await queueSqsRepository.findByCode(data.queueCode);
        if (existing) {
            throw new BadRequestException(`Queue with code '${data.queueCode}' already exists`);
        }
    }

    const updated = await queueSqsRepository.update(queue, data);
    return serviceResponse(true, HTTP_CODES.OK, 'Queue updated successfully', updated);
};

const deleteQueue = async (id) => {
    const queue = await queueSqsRepository.findById(id);
    if (!queue) {
        throw new NotFoundException('Queue not found');
    }

    await queueSqsRepository.destroy(queue);
    return serviceResponse(true, HTTP_CODES.OK, 'Queue deleted successfully', null);
};

module.exports = {
    createQueue,
    getAllQueues,
    getQueueById,
    getQueueByCode,
    updateQueue,
    deleteQueue,
};
