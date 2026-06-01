const notificationQueueSqsService = require('./notification-queue-sqs.service');
const { successResponse } = require('../../helpers/response');

const createQueue = async (req, res, next) => {
    try {
        const result = await notificationQueueSqsService.createQueue(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllQueues = async (req, res, next) => {
    try {
        const filters = {
            priority: req.query.priority,
        };
        const result = await notificationQueueSqsService.getAllQueues(filters);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getQueueById = async (req, res, next) => {
    try {
        const result = await notificationQueueSqsService.getQueueById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getQueueByCode = async (req, res, next) => {
    try {
        const result = await notificationQueueSqsService.getQueueByCode(req.params.code);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const updateQueue = async (req, res, next) => {
    try {
        const result = await notificationQueueSqsService.updateQueue(req.params.id, req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const deleteQueue = async (req, res, next) => {
    try {
        const result = await notificationQueueSqsService.deleteQueue(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQueue,
    getAllQueues,
    getQueueById,
    getQueueByCode,
    updateQueue,
    deleteQueue,
};
