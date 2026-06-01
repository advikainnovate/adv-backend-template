'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationWorkerLockSQS extends Model {
        static associate(models) {
            NotificationWorkerLockSQS.belongsTo(models.NotificationQueueSQS, {
                foreignKey: 'queue_code',
                targetKey: 'queueCode',
                as: 'queue',
            });
        }
    }
    NotificationWorkerLockSQS.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            queueCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lockedBy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lockedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: NotificationWorkerLockSQS.name,
            tableName: 'notification_worker_locks_sqs',
            underscored: true,
            timestamps: true,
        }
    );
    return NotificationWorkerLockSQS;
};
