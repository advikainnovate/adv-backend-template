const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserModel extends Model {
        static associate(model) {
            // UserModel.hasOne(model.UserProfileModel, { foreignKey: 'userId', as: 'userProfile' });
            // UserModel.hasOne(model.UserCompanyModel, { foreignKey: 'userId', as: 'userCompany' });
        }
    }

    UserModel.init(
        {
            idd: { type: DataTypes.STRING, allowNull: true, unique: true },
            userType: {
                type: DataTypes.STRING,
                defaultValue: 'client',
            },
            username: { type: DataTypes.STRING, allowNull: false, unique: true },
            display_name: { type: DataTypes.STRING, allowNull: true },
            email: { type: DataTypes.STRING, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
            countryCode: { type: DataTypes.STRING, allowNull: true },
            phoneNumber: { type: DataTypes.STRING, allowNull: true },
            phoneVerification: { type: DataTypes.BOOLEAN, defaultValue: false },
            emailVerification: { type: DataTypes.BOOLEAN, defaultValue: false },
            gender: { type: DataTypes.ENUM('male', 'female', 'other'), defaultValue: 'male' },
            status: { type: DataTypes.STRING, defaultValue: 'pending' },
        },
        {
            sequelize,
            modelName: UserModel.name,
            tableName: 'users',
            paranoid: true,
            timestamps: true,
        }
    );

    return UserModel;
};
