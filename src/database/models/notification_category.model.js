'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class NotificationCategory extends Model {
        static associate(models) {
            // define association here
        }
    }
    NotificationCategory.init(
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
            modelName: NotificationCategory.name,
            tableName: 'notification_categories',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return NotificationCategory;
};
