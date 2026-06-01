'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        static associate(models) {
            Notification.belongsTo(models.NotificationType, {
                foreignKey: 'notification_type_code',
                targetKey: 'code',
                as: 'notificationType',
            });
            Notification.belongsTo(models.NotificationChannel, {
                foreignKey: 'channel',
                targetKey: 'code',
                as: 'notificationChannel',
            });
            Notification.hasMany(models.NotificationDeliveryAttempt, {
                foreignKey: 'notification_id',
                as: 'deliveryAttempts',
            });
        }
    }
    Notification.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userType: {
                type: DataTypes.STRING,
                allowNull: false,
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
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            payload: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED', 'RETRY', 'CANCELLED'),
                defaultValue: 'PENDING',
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            priority: {
                type: DataTypes.STRING,
                defaultValue: 'LOW',
            },
            sentAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: Notification.name,
            tableName: 'notifications',
            underscored: true,
            timestamps: true,
        }
    );
    return Notification;
};
