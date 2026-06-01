'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_delivery_attempts', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            notification_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'notifications',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            provider: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            attempt_no: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'SUCCESS', 'FAILED'),
                defaultValue: 'PENDING',
                allowNull: false,
            },
            error_message: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            response: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            attempted_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notification_delivery_attempts');
    },
};
