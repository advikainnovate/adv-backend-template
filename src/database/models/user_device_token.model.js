'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserDeviceToken extends Model {
        static associate(models) {
            // Associations can be defined here if needed
        }
    }
    UserDeviceToken.init(
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
            deviceToken: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            platform: {
                type: DataTypes.ENUM('android', 'ios', 'web'),
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            sequelize,
            modelName: UserDeviceToken.name,
            tableName: 'user_device_tokens',
            underscored: true,
            timestamps: true,
            paranoid: true,
        }
    );
    return UserDeviceToken;
};
