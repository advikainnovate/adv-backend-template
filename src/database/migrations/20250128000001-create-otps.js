'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('otps', {
            id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, primaryKey: true },
            userId: { type: Sequelize.UUID, allowNull: true },
            otpType: { type: Sequelize.ENUM('email', 'phone'), allowNull: false, defaultValue: 'email' },
            otp: { type: Sequelize.STRING, allowNull: false },
            expiresAt: { type: Sequelize.DATE, allowNull: false },
            verified: { type: Sequelize.BOOLEAN, defaultValue: false },
            status: { type: Sequelize.ENUM('active', 'inactive'), defaultValue: 'active' },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('otps');
    },
};
