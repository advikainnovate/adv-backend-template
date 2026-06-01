const BaseChannelProvider = require('./base.provider');
const logger = require('pino')();
// const twilio = require('twilio'); // Uncomment when installing twilio
const { CONFIG } = require('../../config');

class SmsProvider extends BaseChannelProvider {
    constructor() {
        super();
        // Initialize Twilio client here
        // this.client = twilio(CONFIG.SMS.ACCOUNT_SID, CONFIG.SMS.AUTH_TOKEN);
    }

    /**
     * Send an SMS
     * @param {Object} payload
     * @param {string} payload.to - Recipient phone number
     * @param {string} payload.body - SMS content
     */
    async send(payload) {
        console.log("SMS not implemented");
        return { success: false, error: "SMS not implemented" };
    }
}

module.exports = new SmsProvider();
