'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RoleNotificationPreference extends Model {
        static associate(models) {
            RoleNotificationPreference.belongsTo(models.NotificationCategory, {
                foreignKey: 'category_code',
                targetKey: 'code',
                as: 'category',
            });
            RoleNotificationPreference.belongsTo(models.NotificationChannel, {
                foreignKey: 'channel',
                targetKey: 'code',
                as: 'notificationChannel',
            });
        }
    }
    RoleNotificationPreference.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
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
            modelName: RoleNotificationPreference.name,
            tableName: 'role_notification_preferences',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return RoleNotificationPreference;
};
