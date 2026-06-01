'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_notification_preferences', {
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
            is_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_notification_preferences');
    },
};
