let { Sequelize, Model, DataTypes, QueryTypes, sequelizecon } =require("../init/DBconfig")

class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allownull: false,
        },
        mobileno: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allownull: false,
        },
        password: {
            type: DataTypes.STRING,
            allownull: false,
        },
        token: {
            type: DataTypes.STRING,
            allownull: false,
        },
        OTP: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, { ModelName: "User", tableName: "User", sequelize: sequelizecon })

module.exports = { User }

