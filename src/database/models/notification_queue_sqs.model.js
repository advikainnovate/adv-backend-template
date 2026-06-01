'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationQueueSQS extends Model {
        static associate(models) {
            // define association here
        }
    }
    NotificationQueueSQS.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            queueCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            priority: {
                type: DataTypes.ENUM('HIGH', 'LOW'),
                defaultValue: 'LOW',
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },

        },
        {
            sequelize,
            modelName: NotificationQueueSQS.name,
            tableName: 'notification_queues_sqs',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return NotificationQueueSQS;
};
