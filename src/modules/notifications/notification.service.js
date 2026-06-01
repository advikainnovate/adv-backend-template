const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const sqsClient = require('../../config/sqs.connection');
const {
    notificationRepository,
    templateRepository,
    typeRepository,
    deliveryAttemptRepository,
    userDeviceTokenRepository
} = require('../../repositories');
const { userPreferenceService } = require('../user-preferences/user-preference.service');
const { renderTemplate, validateVariables } = require('../../utils/templateRenderer');
const { ChannelFactory, CHANNEL_TYPES } = require('../../helpers/channels');
const { serviceResponse } = require('../../helpers/response');
const { HTTP_CODES, CONFIG } = require('../../config');
const { NotFoundException, BadRequestException } = require('../../helpers/errorResponse');

/**
 * Send a notification
 * @param {object} data - Notification data
 * @param {string} data.userId - User ID
 * @param {string} data.userType - User type (customer, driver, admin)
 * @param {string} data.notificationTypeCode - Notification type code
 * @param {string} data.channel - Channel code (email, sms, push, etc.)
 * @param {object} data.variables - Variables for template rendering
 * @param {string} data.recipient - Recipient address (email, phone, device token, etc.)
 * @param {object} data.metadata - Additional metadata
 */
const sendNotification = async (data) => {
    const { userId, userType, notificationTypeCode, channel, variables = {}, recipient, metadata = {}, useQueue = false } = data;

    // 1. Validate notification type exists
    const notificationType = await typeRepository.findByCode(notificationTypeCode);
    if (!notificationType) {
        throw new NotFoundException(`Notification type '${notificationTypeCode}' not found`);
    }

    // 2. Check if notification type is active
    if (!notificationType.isActive) {
        return serviceResponse(false, HTTP_CODES.BAD_REQUEST, 'Notification type is not active', null);
    }

    // Optional: Queue notification via SQS
    if (useQueue) {
        const queueResult = await queueNotification(data, notificationType.categoryCode);
        return serviceResponse(true, HTTP_CODES.ACCEPTED, 'Notification queued successfully via SQS', queueResult);
    }

    // Resolve channels if channel is an array or omitted
    if (!channel || Array.isArray(channel)) {
        const channelsToDispatch = Array.isArray(channel)
            ? channel
            : await templateRepository.findActiveChannels(notificationTypeCode, notificationType.categoryCode, userType);

        if (channelsToDispatch.length === 0) {
            throw new NotFoundException(`No active templates found for type '${notificationTypeCode}', userType '${userType}'`);
        }

        const results = await Promise.all(
            channelsToDispatch.map(async (ch) => {
                try {
                    const res = await sendNotification({
                        ...data,
                        channel: ch,
                    });
                    return {
                        channel: ch,
                        success: res.success,
                        code: res.code,
                        message: res.message,
                        data: res.data,
                        shouldRetry: res.shouldRetry,
                    };
                } catch (error) {
                    return {
                        channel: ch,
                        success: false,
                        message: error.message,
                    };
                }
            })
        );

        const anySuccess = results.some((r) => r.success);
        let outerShouldRetry = true;
        for (const r of results) {
            if (!r.success && r.shouldRetry === false) {
                outerShouldRetry = false;
            }
        }

        const outerRes = serviceResponse(
            anySuccess,
            anySuccess ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST,
            anySuccess ? 'Notifications processed successfully' : 'Failed to process notifications',
            { results }
        );

        if (!anySuccess && outerShouldRetry === false) {
            outerRes.shouldRetry = false;
        }

        return outerRes;
    }

    // 3. Check user preferences
    const { checkUserPreference } = require('../user-preferences/user-preference.service');
    const preferenceCheck = await checkUserPreference(userId, userType, notificationType.categoryCode, channel);

    if (!preferenceCheck.isEnabled) {
        const response = serviceResponse(false, HTTP_CODES.OK, 'Notification blocked by user preference', {
            blocked: true,
            reason: 'user_preference',
        });
        response.shouldRetry = false;
        return response;
    }

    // 4. Find appropriate template
    const template = await templateRepository.findOne({
        notificationTypeCode,
        categoryCode: notificationType.categoryCode,
        channel,
        userType,
        isActive: true,
    });

    if (!template) {
        throw new NotFoundException(`No active template found for type '${notificationTypeCode}', channel '${channel}', userType '${userType}'`);
    }

    // 5. Validate variables
    const variableValidation = validateVariables(template.variables || [], variables);
    if (!variableValidation.valid) {
        throw new BadRequestException(`Missing required variables: ${variableValidation.missing.join(', ')}`);
    }

    // 6. Render template
    const renderedSubject = renderTemplate(template.subject, variables);
    const renderedBody = renderTemplate(template.body, variables);

    // 7. Create notification record
    const notification = await notificationRepository.create({
        userId,
        userType,
        notificationTypeCode,
        categoryCode: notificationType.categoryCode,
        channel,
        title: renderedSubject,
        message: renderedBody,
        status: 'PENDING',
        priority: notificationType.priority,
        payload: {
            variables,
            metadata,
            recipient, // Keeping recipient in payload for the provider to use, even if not in table
        },
    });

    // 8. Send through channel provider
    let channelProvider;
    try {
        channelProvider = ChannelFactory.getProvider(channel);
    } catch (error) {
        // Update notification status
        await notificationRepository.update(notification, { status: 'FAILED' });

        // Log delivery attempt
        await deliveryAttemptRepository.create({
            notificationId: notification.id,
            channel,
            attemptNo: 1,
            status: 'FAILED',
            errorMessage: error.message,
        });

        throw new BadRequestException(error.message);
    }

    try {
        // Resolve recipients
        let recipients = [];
        if (channel.toUpperCase() === 'PUSH' && !recipient) {
            const tokenResult = await userDeviceTokenRepository.findAll({ userId, userType, isActive: true });
            const tokens = Array.isArray(tokenResult) ? tokenResult : (tokenResult.data || []);
            recipients = tokens.map((t) => t.deviceToken);
            if (recipients.length === 0) {
                const errorMsg = `No active push tokens registered for userId: ${userId}, userType: ${userType}`;
                await notificationRepository.update(notification, { status: 'FAILED' });
                await deliveryAttemptRepository.create({
                    notificationId: notification.id,
                    channel,
                    attemptNo: 1,
                    status: 'FAILED',
                    errorMessage: errorMsg,
                });
                const response = serviceResponse(false, HTTP_CODES.NOT_FOUND, errorMsg, null);
                response.shouldRetry = false;
                return response;
            }
        } else {
            if (!recipient) {
                throw new BadRequestException(`Recipient is required for channel '${channel}'`);
            }
            recipients = [recipient];
        }

        const results = [];
        let anySuccess = false;
        let lastError = null;
        let lastProviderResponse = null;
        let shouldRetry = true;

        for (const targetRecipient of recipients) {
            const payload = {
                to: targetRecipient,
                subject: renderedSubject,
                html: renderedBody,
                text: renderedBody,
                title: renderedSubject,
                body: renderedBody,
            };

            const sendResult = await channelProvider.send(payload);
            results.push({
                recipient: targetRecipient,
                success: sendResult.success,
                response: sendResult.providerResponse,
                error: sendResult.error,
            });

            if (sendResult.success) {
                anySuccess = true;
                lastProviderResponse = sendResult.providerResponse;
            } else {
                lastError = sendResult.error;
                if (sendResult.shouldRetry === false) {
                    shouldRetry = false;
                }
            }
        }

        // Update notification status
        await notificationRepository.update(notification, {
            status: anySuccess ? 'SENT' : 'FAILED',
            sentAt: anySuccess ? new Date() : null,
        });

        // Log delivery attempt
        await deliveryAttemptRepository.create({
            notificationId: notification.id,
            channel,
            provider: channel,
            attemptNo: 1,
            status: anySuccess ? 'SUCCESS' : 'FAILED',
            errorMessage: anySuccess ? null : lastError,
            response: results.length === 1 ? lastProviderResponse || lastError : results,
        });

        const serviceRes = serviceResponse(
            anySuccess,
            anySuccess ? HTTP_CODES.OK : HTTP_CODES.BAD_REQUEST,
            anySuccess ? 'Notification sent successfully' : 'Notification failed to send',
            {
                notificationId: notification.id,
                status: anySuccess ? 'SENT' : 'FAILED',
                channel,
                recipients,
                providerResponse: results.length === 1 ? lastProviderResponse : results,
            }
        );

        if (!anySuccess && shouldRetry === false) {
            serviceRes.shouldRetry = false;
        }

        return serviceRes;

    } catch (error) {
        console.error('Error sending notification:', error);

        // Update notification status
        await notificationRepository.update(notification, { status: 'FAILED' });

        // Log delivery attempt
        await deliveryAttemptRepository.create({
            notificationId: notification.id,
            channel,
            attemptNo: 1,
            status: 'FAILED',
            errorMessage: error.message,
        });

        throw error;
    }
};

/**
 * Get notification by ID
 */
const getNotificationById = async (id) => {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
        throw new NotFoundException('Notification not found');
    }

    return serviceResponse(true, HTTP_CODES.OK, 'Notification retrieved successfully', notification);
};

/**
 * Get all notifications with filters
 */
const getAllNotifications = async (query = {}) => {
    const result = await notificationRepository.findAll(query);

    return serviceResponse(true, HTTP_CODES.OK, 'Notifications retrieved successfully', result);
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (id) => {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
        throw new NotFoundException('Notification not found');
    }

    const updated = await notificationRepository.update(notification, { isRead: true });
    return serviceResponse(true, HTTP_CODES.OK, 'Notification marked as read successfully', updated);
};

/**
 * Mark all notifications as read for a user
 */
const markAllNotificationsAsRead = async (userId, userType) => {
    await notificationRepository.updateMany(
        { userId, userType, isRead: false },
        { isRead: true }
    );
    return serviceResponse(true, HTTP_CODES.OK, 'All notifications marked as read successfully', null);
};

/**
 * Get unread notifications count for a user
 */
const getUnreadNotificationsCount = async (userId, userType) => {
    const notifications = await notificationRepository.findAll({
        userId,
        userType,
        isRead: false,
        channel: CHANNEL_TYPES.WEB
    });

    return serviceResponse(true, HTTP_CODES.OK, 'Unread notifications count and list retrieved successfully', {
        count: notifications.length,
        notifications
    });
};

/**
 * Queue a notification via SQS
 */
const queueNotification = async (data, categoryCode) => {
    let queueType = 'ORDERS';
    if (categoryCode && (categoryCode.toUpperCase().includes('PROMOTION') || categoryCode.toUpperCase().includes('PROMO'))) {
        queueType = 'PROMOTIONS';
    }

    const queueUrl = CONFIG.AWS.QUEUES[queueType];
    if (!queueUrl) {
        throw new BadRequestException(`Queue URL for type ${queueType} is not defined`);
    }

    // Prepare message body (exclude useQueue to prevent loop)
    const { useQueue, ...messageBody } = data;

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
        MessageGroupId: data.notificationTypeCode || 'default-group',
        MessageDeduplicationId: `dedup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const response = await sqsClient.send(command);
    return {
        messageId: response.MessageId,
        queue: queueType
    };
};

module.exports = {
    sendNotification,
    queueNotification,
    getNotificationById,
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
};
