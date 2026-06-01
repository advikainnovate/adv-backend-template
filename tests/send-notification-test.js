/**
 * Test Script: Send Notification Directly (Without SQS)
 * 
 * This script tests the notification service directly by calling the API endpoint.
 * Use this to test notifications without setting up SQS queues.
 */

const axios = require('axios');

// --- Configuration ---
const API_BASE_URL = 'http://localhost:5002/api/v1';

// Test notification data
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
        orderTotal: '$99.99'
    },
    metadata: {
        // Additional metadata (optional)
        orderId: 'order-uuid-123',
        source: 'direct-test'
    }
};

// --- Main Test Function ---
const testSendNotification = async () => {
    console.log('\n📤 Testing Notification Service');
    console.log('================================\n');
    console.log('📋 Notification Payload:');
    console.log(JSON.stringify(testNotification, null, 2));
    console.log('\n🚀 Sending request to:', `${API_BASE_URL}/notifications/send`);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/notifications/send`,
            testNotification
        );

        console.log('\n✅ SUCCESS!');
        console.log('Response:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('\n❌ ERROR!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

// --- Prerequisites Check ---
const checkPrerequisites = () => {
    console.log('\n📝 Prerequisites:');
    console.log('1. ✓ Server running on port 5002');
    console.log('2. ✓ Database migrations completed');
    console.log('3. ✓ Category exists (e.g., "orders")');
    console.log('4. ✓ Channel exists (e.g., "email")');
    console.log('5. ✓ Notification type exists (e.g., "order_created")');
    console.log('6. ✓ Template exists for type + channel + userType');
    console.log('\n💡 Run seeders first: npm run db:seed\n');
};

// Run the test
checkPrerequisites();
testSendNotification();
