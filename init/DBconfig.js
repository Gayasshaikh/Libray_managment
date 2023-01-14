let { Sequelize, Model, DataTypes, QueryTypes, Op } = require("sequelize");

let sequelizecon = new Sequelize("mysql://root:@localhost/L-M");

sequelizecon.authenticate().then(() => {
    console.log("connected")
}).catch(() => { console.log("Error") });

module.exports = { Sequelize, Model, DataTypes, QueryTypes, Op, sequelizecon };

