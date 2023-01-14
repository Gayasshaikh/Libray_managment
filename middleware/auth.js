let { Sequelize, Model, DataTypes, QueryTypes, Op, sequelizecon } = require("../init/DBconfig");
let becrypt = require("bcrypt")
let { decrypt } = require("../helper/security");


function Auth(permissionkey) {
    return async (req, res, next) => {
        let token = req.header("token-g");
        if (!token) {
            return res.status(400).send({ error: 'internl serve error 0' })
        }
        let data = await decrypt(token, "1234").catch((err) => { return { error: err } });
        if (!data || (data && data.error)) {
            return res.status(401).send({ error: "internal server error 1" })
        }
        let user = await sequelizecon.query(
            `select User.id,user.name,permission
            from User
            left join user_permission as up
              on User.id=UP.user_id
            left join permission as p
              on UP.user_permission=p.id
              where User.id=${data.id}`,
            { type: QueryTypes.SELECT }
        ).catch((err) => {

            return { error: err }
        })
        if (!user || (user && user.error)) {
console.log(user)
            return res.status(400).send("internal server error 2")
        }
        let permission = {};
        for (let row of user) {
            permission[row.permission] = 1

            if (permission.length <= 0 || !permission[permissionkey]) {
                    console.log("permission",permission)
                return res.status(401).send("internal server error 3")
            }
            req.userData = {
                id: data.id,
                name: user.name,
                permission: permissionkey

            }


        }
        
        next();
    }

}
module.exports = { Auth }

