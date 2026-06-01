const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { CONFIG } = require('../src/config');
const sqsSetup = require("./setup-sqs-test");

// --- Test Configuration ---
const targetQueue = 'ORDERS';

// 2. Define the notification payload (WRAPPED IN SNS ENVELOPE)
const innerPayload = {
    userId: 'user-sns-test',
    userType: 'customer',
    notificationTypeCode: 'order_created',
    channel: 'email',
    recipient: 'candyurahara@gmail.com',
    variables: {
        orderNumber: 'SNS-12345',
        customerName: 'SNS Tester',
        orderTotal: '$500.00',
        trackingUrl: 'https://track.example.com/SNS123456'
    },
    metadata: {
        source: 'sns-simulation'
    }
};

const snsEnvelope = {
    Type: "Notification",
    MessageId: "sns-message-id-123",
    TopicArn: "arn:aws:sns:region:account:topic-name",
    Message: JSON.stringify(innerPayload), // The critical part: Message is a stringified JSON
    Timestamp: new Date().toISOString(),
    SignatureVersion: "1",
    Signature: "EXAMPLE_SIGNATURE",
    SigningCertURL: "EXAMPLE_URL",
    UnsubscribeURL: "EXAMPLE_URL"
};

// --- End of Test Configuration ---

const sqsClient = new SQSClient({
    region: CONFIG.AWS.REGION,
    credentials: {
        accessKeyId: CONFIG.AWS.ACCESS_KEY_ID,
        secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: "https://api.advikainnovate.cloud/sqs-test"
});

const main = async () => {
    await sqsSetup();

    const queueUrl = CONFIG.AWS.QUEUES.ORDERS;

    console.log(`\n📤 Sending SNS-wrapped notification to ${targetQueue} queue`);
    console.log(`   Queue URL: ${queueUrl}`);
    console.log('\n📦 SNS Envelope Payload:');
    console.log(JSON.stringify(snsEnvelope, null, 2));

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(snsEnvelope),
    });

    try {
        const response = await sqsClient.send(command);
        console.log('\n✅ SNS Message sent successfully!');
        console.log('   Message ID:', response.MessageId);
        console.log('\n💡 The worker should now detect the SNS envelope and Unwrap it.');
    } catch (error) {
        console.error('\n❌ Error sending message:', error.message);
    }
};

main();
