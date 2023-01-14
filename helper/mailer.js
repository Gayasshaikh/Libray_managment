let nodemailer = require("nodemailer");

async function email(mailoption) {
    return new Promise((res, rej) => {
        let mailer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "shaikhgayas87@gmail.com",
                pass: "plhelgixhrfnbrek"
            }
        })

        mailer.sendMail(mailoption, (error, info) => {


            if (error) {
                console.log(error)
                rej(false)
            }
            else {
                res("mail send", true)

            }

        })
    })
}

//let fp = "forget password"

module.exports = { email }