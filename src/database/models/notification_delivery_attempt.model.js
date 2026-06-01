'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationDeliveryAttempt extends Model {
        static associate(models) {
            NotificationDeliveryAttempt.belongsTo(models.Notification, {
                foreignKey: 'notification_id',
                as: 'notification',
            });
        }
    }
    NotificationDeliveryAttempt.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            notificationId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            channel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            provider: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            attemptNo: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
                defaultValue: 'PENDING',
                allowNull: false,
            },
            errorMessage: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            response: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            attemptedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: NotificationDeliveryAttempt.name,
            tableName: 'notification_delivery_attempts',
            underscored: true,
            timestamps: true,
        }
    );
    return NotificationDeliveryAttempt;
};
