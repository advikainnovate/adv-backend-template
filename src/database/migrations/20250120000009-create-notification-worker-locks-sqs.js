'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_worker_locks_sqs', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
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
            locked_by: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            locked_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            expires_at: {
                allowNull: false,
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('notification_worker_locks_sqs');
    },
};
