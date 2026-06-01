'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_outbox_sqs', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            event_code: {
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
                references: {
                    model: 'notification_categories',
                    key: 'code',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            payload: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            queue_code: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'notification_queues_sqs',
                    key: 'queue_code',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'PUBLISHED'),
                defaultValue: 'PENDING',
            },
            retry_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable('notification_outbox_sqs');
    },
};
