const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const sqsClient = require('../../config/sqs.connection');
const { CONFIG } = require('../../config');
const notificationService = require('../notifications/notification.service');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES } = require('../../config');

const sendDirect = async (data) => {
    return await notificationService.sendNotification(data);
};

const sendQueue = async (data) => {
    const { queueType = 'ORDERS', payload } = data;
    const queueUrl = CONFIG.AWS.QUEUES[queueType.toUpperCase()];
    
    if (!queueUrl) {
        return serviceResponse(false, HTTP_CODES.BAD_REQUEST, `Queue URL for type ${queueType} is not defined`, null);
    }

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
        MessageGroupId: payload.notificationTypeCode || 'test-group',
        MessageDeduplicationId: `dedup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const response = await sqsClient.send(command);
    return serviceResponse(true, HTTP_CODES.OK, 'Message published to SQS successfully', response);
};

module.exports = {
    sendDirect,
    sendQueue
};
