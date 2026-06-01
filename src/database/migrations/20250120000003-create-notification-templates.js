'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_templates', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            template_code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
            user_type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            subject: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            body: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            variables: {
                type: Sequelize.JSONB,
                defaultValue: [],
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
        await queryInterface.dropTable('notification_templates');
    },
};
