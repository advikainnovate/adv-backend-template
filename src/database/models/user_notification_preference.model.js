'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserNotificationPreference extends Model {
        static associate(models) {
            UserNotificationPreference.belongsTo(models.NotificationCategory, {
                foreignKey: 'category_code',
                targetKey: 'code',
                as: 'category',
            });
            UserNotificationPreference.belongsTo(models.NotificationChannel, {
                foreignKey: 'channel',
                targetKey: 'code',
                as: 'notificationChannel',
            });
        }
    }
    UserNotificationPreference.init(
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
            categoryCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            channel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isEnabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: UserNotificationPreference.name,
            tableName: 'user_notification_preferences',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return UserNotificationPreference;
};
