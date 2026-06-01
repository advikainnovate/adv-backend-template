'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationType extends Model {
        static associate(models) {
            NotificationType.belongsTo(models.NotificationCategory, {
                foreignKey: 'category_code',
                targetKey: 'code',
                as: 'category',
            });
            NotificationType.hasMany(models.NotificationTemplate, {
                foreignKey: 'notification_type_code',
                sourceKey: 'code',
                as: 'templates',
            });
        }
    }
    NotificationType.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            categoryCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            priority: {
                type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
                defaultValue: 'LOW',
            },
            throttleMinutes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },

        },
        {
            sequelize,
            modelName: NotificationType.name,
            tableName: 'notification_types',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return NotificationType;
};
