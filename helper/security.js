let jwt = require("jsonwebtoken");

function encrypt(data, key) {
    return new Promise((res, rej) => {
        jwt.sign(data, key, (err, token) => {
            if (err) {
                console.log(err)
                rej(err);
            }

            res(token);
        })
    })
}

function decrypt(data, key) {
    return new Promise((res, rej) => {
        jwt.verify(data, key, (err, token) => {
            if (err) {
                console.log(err)
                rej(err);
            }

            res(token);
        })
    })
}
module.exports = { encrypt, decrypt }