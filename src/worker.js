const sqsConsumer = require('./workers/sqs.consumer');
const logger = require('pino')();
const { sequelize } = require('./database/models');
const sqsSetup = require("../tests/setup-sqs-test");
const { CONFIG } = require("./config") 

const startWorker = async () => {
    try {
        // 1. Connect to Database
        await sequelize.authenticate();
        logger.info('Database connected.');

        // Setup SQS for test(Optional)
        if (CONFIG.APP.NODE_ENV === "development" && process.env.USE_MOCK_SQS === "true"){
            await sqsSetup();
        }

        // 2. Start SQS Consumer
        const sqs = new sqsConsumer();
        sqs.start();

    } catch (error) {
        logger.error('Unable to start worker:', error);
        process.exit(1);
    }
};

startWorker();
