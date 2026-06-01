const { SQSClient } = require('@aws-sdk/client-sqs');
const { CONFIG } = require('./');

const config = {
    region: CONFIG.AWS.REGION,
    credentials: {
        accessKeyId: CONFIG.AWS.ACCESS_KEY_ID,
        secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
    }
}

if (CONFIG.APP.NODE_ENV === 'development' && process.env.USE_MOCK_SQS === 'true') {
    config.endpoint = "https://api.advikainnovate.cloud/sqs-test"
}

const sqsClient = new SQSClient(config);

module.exports = sqsClient;
