'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationOutboxSQS extends Model {
        static associate(models) {
            NotificationOutboxSQS.belongsTo(models.NotificationType, {
                foreignKey: 'event_code',
                targetKey: 'code',
                as: 'notificationType',
            });
            NotificationOutboxSQS.belongsTo(models.NotificationCategory, {
                foreignKey: 'category_code',
                targetKey: 'code',
                as: 'category',
            });
            NotificationOutboxSQS.belongsTo(models.NotificationQueueSQS, {
                foreignKey: 'queue_code',
                targetKey: 'queueCode',
                as: 'queue',
            });
        }
    }
    NotificationOutboxSQS.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            eventCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            categoryCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payload: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            queueCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('PENDING', 'PUBLISHED'),
                defaultValue: 'PENDING',
            },
            retryCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: NotificationOutboxSQS.name,
            tableName: 'notification_outbox_sqs',
            underscored: true,
            timestamps: true,
        }
    );
    return NotificationOutboxSQS;
};
