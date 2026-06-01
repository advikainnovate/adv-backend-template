const { ERROR } = require('../../config/messages');

class BaseChannelProvider {
    constructor() {
        if (this.constructor === BaseChannelProvider) {
            throw new Error(ERROR.ABSTRACT_CLASS_INSTANTIATION);
        }
    }

    /**
     * Send a notification
     * @param {Object} payload - The notification payload
     * @returns {Promise<Object>} - The result of the send operation
     */
    async send(payload) {
        throw new Error(ERROR.METHOD_NOT_IMPLEMENTED);
    }
}

module.exports = BaseChannelProvider;
