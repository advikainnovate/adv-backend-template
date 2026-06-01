const BaseChannelProvider = require('./base.provider');
const logger = require('pino')();
const admin = require('firebase-admin');
const { CONFIG } = require('../../config');
const userDeviceTokenRepository = require('../../repositories/userDeviceToken.repository');

class PushProvider extends BaseChannelProvider {
    constructor() {
        super();
        if (!admin.apps.length) {
            if (CONFIG.FCM.PROJECT_ID && CONFIG.FCM.CLIENT_EMAIL && CONFIG.FCM.PRIVATE_KEY) {
                try {
                    admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId: CONFIG.FCM.PROJECT_ID,
                            clientEmail: CONFIG.FCM.CLIENT_EMAIL,
                            privateKey: CONFIG.FCM.PRIVATE_KEY,
                        }),
                    });
                    logger.info('Firebase Admin SDK initialized successfully.');
                } catch (error) {
                    logger.error(`Failed to initialize Firebase Admin SDK: ${error.message}`);
                }
            } else {
                logger.warn('FCM credentials are not configured. Firebase Admin SDK will not be initialized.');
            }
        }
    }

    /**
     * Send a Push Notification
     * @param {Object} payload
     * @param {string} payload.to - Device token
     * @param {string} payload.title - Notification title
     * @param {string} payload.body - Notification body
     * @param {Object} [payload.data] - Additional data payload
     */
    async send(payload) {
        try {
            if (!admin.apps.length) {
                logger.warn('FCM is not initialized. Skipping push sending.');
                return { success: false, error: 'FCM not initialized' };
            }

            const message = {
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
                token: payload.to,
            };

            const response = await admin.messaging().send(message);
            logger.info(`Push notification sent successfully to ${payload.to}: ${response}`);

            return { success: true, providerResponse: { messageId: response } };
        } catch (error) {
            logger.error(`Push sending failed: ${error.message}`);

            const isInvalidToken = 
                error.code === 'messaging/registration-token-not-registered' ||
                error.code === 'messaging/invalid-registration-token' ||
                (error.message && (
                    error.message.includes('registration token') ||
                    error.message.includes('not a valid FCM registration token')
                ));

            // Automatically clean up invalid/unregistered tokens
            if (isInvalidToken) {
                try {
                    const tokenRecord = await userDeviceTokenRepository.findOne({ deviceToken: payload.to });
                    if (tokenRecord) {
                        await userDeviceTokenRepository.hardDestroy(tokenRecord);
                        logger.info(`Cleaned up invalid/unregistered device token: ${payload.to}`);
                    }
                } catch (dbError) {
                    logger.error(`Failed to clean up invalid token ${payload.to}: ${dbError.message}`);
                }
                return { success: false, error: error.message, shouldRetry: false };
            }

            return { success: false, error: error.message };
        }
    }
}

module.exports = new PushProvider();
