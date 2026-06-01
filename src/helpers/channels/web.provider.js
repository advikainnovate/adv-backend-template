const BaseChannelProvider = require('./base.provider');
const logger = require('pino')();

class WebProvider extends BaseChannelProvider {
    constructor() {
        super();
    }

    /**
     * Send a Web Notification
     * @param {Object} payload
     * @param {string} payload.to - User identifier or target
     * @param {string} payload.title - Notification title
     * @param {string} payload.body - Notification body
     * @param {Object} [payload.data] - Additional data payload
     */
    async send(payload) {
        try {
            logger.info(`[MOCK] Sending Web Notification to ${payload.to}: ${payload.title} - ${payload.body}`);

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return { success: true, providerResponse: { messageId: 'mock_web_id_' + Date.now() } };
        } catch (error) {
            logger.error(`Web notification sending failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new WebProvider();
