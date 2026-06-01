const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { CONFIG } = require('../src/config');
const sqsSetup = require("./setup-sqs-test");

// --- Test Configuration ---
// Modify the values below to send different test notifications.

// 1. Specify the target queue: 'ORDERS' or 'PROMOTIONS'
const targetQueue = 'ORDERS';

// 2. Define the notification payload (NEW FORMAT)
const testNotification = {
    userId: 'user123',
    userType: 'customer', // customer, driver, admin
    notificationTypeCode: 'order_created', // Must exist in notification_types table
    channel: 'email', // email, sms, push, whatsapp, web, in_app
    recipient: 'candyurahara@gmail.com', // Email, phone, device token, etc.
    variables: {
        // Variables for template rendering
        orderNumber: 'ORD-12345',
        customerName: 'John Doe',
        orderTotal: '$99.99',
        trackingUrl: 'https://track.example.com/ORD123456'
    },
    metadata: {
        // Additional metadata (optional)
        orderId: 'order-uuid-123',
        source: 'sqs-test'
    }
};

// --- End of Test Configuration ---

// SQS Client setup for the test environment
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

    // Get queue URL based on target
    const queueUrl = targetQueue === 'ORDERS'
        ? CONFIG.AWS.QUEUES.ORDERS
        : CONFIG.AWS.QUEUES.PROMOTIONS;

    if (!queueUrl) {
        console.error(`Error: Queue URL for '${targetQueue}' is not defined in your config.`);
        console.error('Please ensure your environment variables (e.g., .env file) are set up correctly.');
        return;
    }

    console.log(`\n📤 Sending notification to ${targetQueue} queue`);
    console.log(`   Queue URL: ${queueUrl}`);
    console.log('\n📋 Notification Payload:');
    console.log(JSON.stringify(testNotification, null, 2));

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(testNotification),
        MessageGroupId: testNotification.notificationTypeCode // FIFO queue requires a Group ID
    });

    try {
        const response = await sqsClient.send(command);
        console.log('\n✅ Message sent successfully!');
        console.log('   Message ID:', response.MessageId);
        console.log('\n💡 The worker will process this message and send the notification.');
        console.log('   Make sure:');
        console.log('   1. The notification type exists in the database');
        console.log('   2. A template exists for this type, channel, and userType');
        console.log('   3. The worker is running (npm run worker)');
    } catch (error) {
        console.error('\n❌ Error sending message:', error.message);
    }
};

main();
