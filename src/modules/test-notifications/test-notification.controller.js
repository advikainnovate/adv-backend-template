const testNotificationService = require('./test-notification.service');
const { successResponse } = require('../../helpers/response');

const testWithoutSqs = async (req, res, next) => {
    try {
        const result = await testNotificationService.sendDirect(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

const testWithSqs = async (req, res, next) => {
    try {
        const result = await testNotificationService.sendQueue(req.body);
        return successResponse(res, result.code, result.message, result.data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    testWithoutSqs,
    testWithSqs
};
