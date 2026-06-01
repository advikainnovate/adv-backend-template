const categoryRepository = require('./category.repository');
const channelRepository = require('./channel.repository');
const typeRepository = require('./type.repository');
const templateRepository = require('./template.repository');
const notificationRepository = require('./notification.repository');
const deliveryAttemptRepository = require('./deliveryAttempt.repository');
const userPreferenceRepository = require('./userPreference.repository');
const rolePreferenceRepository = require('./rolePreference.repository');
const queueSqsRepository = require('./queueSqs.repository');
const outboxSqsRepository = require('./outboxSqs.repository');
const workerLockSqsRepository = require('./workerLockSqs.repository');
const userDeviceTokenRepository = require('./userDeviceToken.repository');

module.exports = {
    categoryRepository,
    channelRepository,
    typeRepository,
    templateRepository,
    notificationRepository,
    deliveryAttemptRepository,
    userPreferenceRepository,
    rolePreferenceRepository,
    queueSqsRepository,
    outboxSqsRepository,
    workerLockSqsRepository,
    userDeviceTokenRepository,
};
