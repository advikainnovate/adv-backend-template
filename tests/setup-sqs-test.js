const {SQSClient, CreateQueueCommand } = require("@aws-sdk/client-sqs");
const { CONFIG } = require('../src/config');
// import { SQSClient, CreateQueueCommand } from "@aws-sdk/client-sqs"
// import { CONFIG } from "../src/config/index.js"

const sqsClient = new SQSClient({
    region: CONFIG.AWS.REGION,
    credentials: {
        accessKeyId: CONFIG.AWS.ACCESS_KEY_ID,
        secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: "https://api.advikainnovate.cloud/sqs-test"
});

async function setupQueues() {
    try {
        const orders = await sqsClient.send(new CreateQueueCommand({QueueName: "orders-queue"}));
        console.log("Created queue:", orders.QueueUrl);

        const promotions = await sqsClient.send(new CreateQueueCommand({QueueName: "promotions-queue"}));
        console.log("Created queue:", promotions.QueueUrl);

        CONFIG.AWS.QUEUES.ORDERS = orders.QueueUrl;
        CONFIG.AWS.QUEUES.PROMOTIONS = promotions.QueueUrl;
    }
    catch (error) {
        console.error("Error creating queues:", error);
    }
}

module.exports = setupQueues;

