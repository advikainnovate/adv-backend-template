'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationChannel extends Model {
        static associate(models) {
            NotificationChannel.hasMany(models.NotificationTemplate, {
                foreignKey: 'channel',
                sourceKey: 'code',
                as: 'templates',
            });
        }
    }
    NotificationChannel.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
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
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: NotificationChannel.name,
            tableName: 'notification_channels',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return NotificationChannel;
};
