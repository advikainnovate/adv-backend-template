'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_device_tokens', {
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
            device_token: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            platform: {
                type: Sequelize.ENUM('android', 'ios', 'web'),
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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

        // Index on user_id and user_type for fast query resolution
        await queryInterface.addIndex('user_device_tokens', ['user_id', 'user_type'], {
            name: 'user_device_tokens_user_id_user_type_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_device_tokens');
    },
};
