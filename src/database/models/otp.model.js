const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OtpModel extends Model {
        static associate(model) { }
    }

    OtpModel.init(
        {
            userId: {
                type: DataTypes.UUID,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'users',
                        key: 'id',
                    },
                },
            },
            otpType: { type: DataTypes.ENUM('email', 'phone'), allowNull: false, defaultValue: 'email' },
            otp: { type: DataTypes.STRING, allowNull: false },
            expiresAt: { type: DataTypes.DATE, allowNull: false },
            verified: { type: DataTypes.BOOLEAN, defaultValue: false },
            status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
        },
        {
            sequelize,
            modelName: OtpModel.name,
            tableName: 'otps',
            paranoid: true,
            timestamps: true,
        }
    );

    return OtpModel;
};
