const { ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const sqsClient = require('../config/sqs.connection');
const { CONFIG } = require('../config');
const notificationService = require('../modules/notifications/notification.service');
const logger = require('pino')();

class SQSConsumer {
    constructor() {
        this.queues = []; // Will be populated in start()
        this.isRunning = false;
        this.pollingInterval = 5000; // 5 seconds (Long polling is handled by WaitTimeSeconds)
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        // Read queue URLs from CONFIG (which may have been updated by sqsSetup)
        this.queues = [
            { url: CONFIG.AWS.QUEUES.ORDERS, name: 'Orders' },
            { url: CONFIG.AWS.QUEUES.PROMOTIONS, name: 'Promotions' }
        ];

        logger.info('SQS Worker started. Polling queues...');
        logger.info('Queue URLs:', this.queues);

        this.queues.forEach(queue => {
            if (queue.url) {
                this.poll(queue);
            } else {
                logger.warn(`Queue URL for ${queue.name} is missing. Skipping.`);
            }
        });
    }

    async poll(queue) {
        while (this.isRunning) {
            try {
                const command = new ReceiveMessageCommand({
                    QueueUrl: queue.url,
                    MaxNumberOfMessages: 10, // Batch size
                    WaitTimeSeconds: 20, // Long polling
                    VisibilityTimeout: 60, // Time to process
                });

                const response = await sqsClient.send(command);

                if (response.Messages && response.Messages.length > 0) {
                    logger.info(`Received ${response.Messages.length} messages from ${queue.name}`);

                    // Process messages in parallel
                    await Promise.all(response.Messages.map(msg => this.handleMessage(queue, msg)));
                }

            } catch (error) {
                logger.error(`Error polling ${queue.name}: ${error.message}`);
                // Wait a bit before retrying on error to avoid tight loop
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }

    async handleMessage(queue, message) {
        try {
            let body = JSON.parse(message.Body);

            // Check for SNS Envelope and unwrap if necessary
            if (body.Type === 'Notification' && body.Message) {
                console.log("SNS not implemented");
                return;
            }

            logger.info(`Processing message ${message.MessageId}:`, body);

            // Send notification using the new service
            // Expected body format:
            // {
            //   userId, userType, notificationTypeCode, channel, recipient, variables, metadata
            // }
            const result = await notificationService.sendNotification(body);

            if (result.success || result.shouldRetry === false) {
                // Delete Message on Success or when it's a permanent failure (e.g. invalid FCM token)
                await this.deleteMessage(queue.url, message.ReceiptHandle);
                if (result.success) {
                    logger.info(`Message ${message.MessageId} processed and deleted.`);
                } else {
                    logger.warn(`Message ${message.MessageId} failed with permanent error and deleted: ${result.message}`);
                }
            } else {
                logger.warn(`Message ${message.MessageId} failed processing: ${result.message}`);
                // We don't delete it, so SQS will make it visible again after VisibilityTimeout
            }

        } catch (error) {
            logger.error(`Failed to handle message ${message.MessageId}: ${error.message}`, error);
            // Invalid JSON or other critical errors
            // Leave it in queue for retry or send to Dead Letter Queue
        }
    }

    async deleteMessage(queueUrl, receiptHandle) {
        const command = new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        });
        await sqsClient.send(command);
    }
}

module.exports = SQSConsumer;
