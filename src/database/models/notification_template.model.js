'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationTemplate extends Model {
        static associate(models) {
            NotificationTemplate.belongsTo(models.NotificationType, {
                foreignKey: 'notification_type_code',
                targetKey: 'code',
                as: 'notificationType',
            });
            NotificationTemplate.belongsTo(models.NotificationCategory, {
                foreignKey: 'category_code',
                targetKey: 'code',
                as: 'category',
            });
            NotificationTemplate.belongsTo(models.NotificationChannel, {
                foreignKey: 'channel',
                targetKey: 'code',
                as: 'notificationChannel',
            });
        }
    }
    NotificationTemplate.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            templateCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            notificationTypeCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            channel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            body: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            variables: {
                type: DataTypes.JSONB,
                defaultValue: [],
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

        },
        {
            sequelize,
            modelName: NotificationTemplate.name,
            tableName: 'notification_templates',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return NotificationTemplate;
};
