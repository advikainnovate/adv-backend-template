const { ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');
const sqsClient = require('./src/config/sqs.connection');
const logger = require('pino')();

/**
 * Listens to an SQS queue and processes messages.
 * 
 * @param {Object} params - Configuration parameters
 * @param {string} params.queueUrl - The URL of the SQS queue
 * @param {string} params.queueName - A human-readable name for logging
 * @param {Function} params.processMessage - Async function to process a single message body. 
 *                                           Should return { success: boolean, message?: string } or throw error.
 * @param {Object} [params.options] - Optional SQS parameters
 * @param {number} [params.options.batchSize=10] - Max number of messages to receive
 * @param {number} [params.options.waitTimeSeconds=20] - Long polling wait time
 * @param {number} [params.options.visibilityTimeout=60] - Visibility timeout
 * @param {boolean} [params.shouldDelete=true] - Whether to auto-delete message on success
 */
const listenToQueue = async ({ queueUrl, queueName, processMessage, options = {}, shouldDelete = true }) => {
    // defaults
    const batchSize = options.batchSize || 10;
    const waitTimeSeconds = options.waitTimeSeconds || 20;
    const visibilityTimeout = options.visibilityTimeout || 60;
    let isRunning = true;

    logger.info(`Starting listener for queue: ${queueName} (${queueUrl})`);

    const poll = async () => {
        while (isRunning) {
            try {
                const command = new ReceiveMessageCommand({
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: batchSize,
                    WaitTimeSeconds: waitTimeSeconds,
                    VisibilityTimeout: visibilityTimeout,
                });

                const response = await sqsClient.send(command);

                if (response.Messages && response.Messages.length > 0) {
                    logger.info(`Received ${response.Messages.length} messages from ${queueName}`);

                    // Process messages in parallel
                    await Promise.all(response.Messages.map(async (msg) => {
                        try {
                            const body = JSON.parse(msg.Body);
                            logger.info(`Processing message ${msg.MessageId} from ${queueName}`);

                            await processMessage(body, msg);

                            if (shouldDelete) {
                                await deleteMessage(queueUrl, msg.ReceiptHandle);
                                logger.info(`Message ${msg.MessageId} processed and deleted.`);
                            }
                        } catch (error) {
                            logger.error(`Error processing message ${msg.MessageId} from ${queueName}: ${error.message}`);
                        }
                    }));
                }
            } catch (error) {
                logger.error(`Error polling ${queueName}: ${error.message}`);
                // Simple backoff
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    };

    // Start polling
    poll();

    // Return a stopper function if needed
    return () => { isRunning = false; };
};

const deleteMessage = async (queueUrl, receiptHandle) => {
    const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
    });
    await sqsClient.send(command);
};

module.exports = {
    listenToQueue,
    deleteMessage
};
