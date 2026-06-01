const emailProvider = require('./email.provider');
const smsProvider = require('./sms.provider');
const pushProvider = require('./push.provider');
const webProvider = require('./web.provider');
const { ERROR } = require('../../config/messages');

const CHANNEL_TYPES = {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    PUSH: 'PUSH',
    WEB: 'WEB'
};

class ChannelFactory {
    static getProvider(type) {
        switch (type.toUpperCase()) {
            case CHANNEL_TYPES.EMAIL:
                return emailProvider;
            case CHANNEL_TYPES.SMS:
                return smsProvider;
            case CHANNEL_TYPES.PUSH:
                return pushProvider;
            case CHANNEL_TYPES.WEB:
                return webProvider;
            default:
                throw new Error(ERROR.UNSUPPORTED_CHANNEL_TYPE(type));
        }
    }
}

module.exports = {
    ChannelFactory,
    CHANNEL_TYPES
};
