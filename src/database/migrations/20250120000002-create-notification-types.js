'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_types', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
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
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            priority: {
                type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
                defaultValue: 'LOW',
            },
            throttle_minutes: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            is_active: {
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
        await queryInterface.dropTable('notification_types');
    },
};
