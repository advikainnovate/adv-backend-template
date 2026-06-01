'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('role_notification_preferences', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
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

        // Add a composite unique index on user_type, category_code, and channel
        await queryInterface.addIndex('role_notification_preferences', ['user_type', 'category_code', 'channel'], {
            unique: true,
            name: 'role_pref_user_type_category_channel_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('role_notification_preferences');
    },
};
