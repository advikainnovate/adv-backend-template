'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notifications', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            notification_type_code: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'notification_types',
                    key: 'code',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            category_code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'notification_channels',
                    key: 'code',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            payload: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'SENT', 'FAILED', 'RETRY', 'CANCELLED'),
                defaultValue: 'PENDING',
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            priority: {
                type: Sequelize.STRING,
                defaultValue: 'LOW',
            },
            sent_at: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable('notifications');
    },
};
