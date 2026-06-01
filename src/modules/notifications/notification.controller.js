const notificationService = require('./notification.service');
const { successResponse } = require('../../helpers/response');
const { BadRequestException } = require('../../helpers/errorResponse');

const sendNotification = async (req, res, next) => {
    try {
        const useQueue = req.query.useQueue === 'true' || req.query.useQueue === true;
        const result = await notificationService.sendNotification({ ...req.body, useQueue });
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getNotificationById = async (req, res, next) => {
    try {
        const result = await notificationService.getNotificationById(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getAllNotifications = async (req, res, next) => {
    try {
        const result = await notificationService.getAllNotifications(req.query);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markNotificationAsRead(req.params.id);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.query.userId || (req.user ? req.user.id : undefined);
        const userType = req.query.userType || (req.user ? req.user.role : undefined);

        if (!userId || !userType) {
            throw new BadRequestException('userId and userType are required (either in query parameters or via authorization token)');
        }

        const result = await notificationService.markAllNotificationsAsRead(userId, userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.query.userId || (req.user ? req.user.id : undefined);
        const userType = req.query.userType || (req.user ? req.user.role : undefined);

        if (!userId || !userType) {
            throw new BadRequestException('userId and userType are required (either in query parameters or via authorization token)');
        }

        const result = await notificationService.getUnreadNotificationsCount(userId, userType);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendNotification,
    getNotificationById,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
