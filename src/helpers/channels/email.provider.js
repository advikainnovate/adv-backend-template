const nodemailer = require('nodemailer');
const BaseChannelProvider = require('./base.provider');
const { CONFIG } = require('../../config');
const logger = require('pino')();

class EmailProvider extends BaseChannelProvider {
    constructor() {
        super();
        this.transporter = nodemailer.createTransport({
            host: CONFIG.SMTP.HOST,
            port: CONFIG.SMTP.PORT,
            secure: CONFIG.SMTP.SECURE, // true for 465, false for other ports
            auth: {
                user: CONFIG.SMTP.USER,
                pass: CONFIG.SMTP.PASS,
            },
        });
    }

    /**
     * Send an email
     * @param {Object} payload
     * @param {string} payload.to - Recipient email
     * @param {string} payload.subject - Email subject
     * @param {string} payload.html - Email body (HTML)
     * @param {string} [payload.text] - Email body (Text fallback)
     */
    async send(payload) {
        try {
            const mailOptions = {
                from: CONFIG.SMTP.FROM,
                to: payload.to,
                subject: payload.subject,
                html: payload.html,
                text: payload.text || payload.html.replace(/<[^>]*>?/gm, ''), // Simple strip tags for text fallback
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent: ${info.messageId}`);
            return { success: true, providerResponse: info };
        } catch (error) {
            logger.error(`Email sending failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailProvider();
