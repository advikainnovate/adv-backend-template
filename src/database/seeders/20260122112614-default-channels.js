'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notification_channels', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        code: 'WEB',
        name: 'Web',
        description: 'Website notifications',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        code: 'PUSH',
        name: 'Push',
        description: 'Push notifications',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        code: 'SMS',
        name: 'SMS',
        description: 'Text message',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        code: 'EMAIL',
        name: 'Email',
        description: 'Email message',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_channels', null, {});
  }
};
