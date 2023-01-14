let joi=require("joi")
let {User}=require("../schema/userschema")
let bcrypt=require("bcrypt")
let {encrypt}=require("../helper/security")
let {Auth}=require("../middleware/auth")
let {email}=require("../helper/mailer")
let randomstring = require("randomstring")

//register
async function validateregister(params) {
    let schema=joi.object({
        name:joi.string().min(3).max(55).required(),
        email:joi.string().min(5).max(55).required(),
        password:joi.string().min(3).max(20).required(),
    })
    let valid = await schema.validate(params, { abortEarly: false });
    if (valid.error) {
        let msg = []
        for (let err of valid.error.details) {
            msg.push(err.message)
        }
        return { error: msg }
    }
    return { data: valid.value }
}

async function userregister(params){
    let verify=await validateregister(params).catch((err)=>{ return {error:err}})
    if(!verify||verify.error){
        return({error:verify})
    }
    let password=await bcrypt.hash(params.password,10).catch((err)=>{return{error:err}})
    if(!password||password.error){
        return({error:"internal server  1"})
    }

    params.password=password

    let add = await User.create(params).catch((err)=>{
        return {error : err}
    })
    console.log(add)
    if(!add||add.error){
        return ({error:"internal server error 2"})
    }

    let givepermission = await user_permission.create({
        user_id: users.id,
        Permission_id: 3
    }).catch((err) => { return { error: err } });
    if (!givepermission || givepermission.error) {
        return { error: "somthing worng" }
    }

    return ({data:"register successfully"})

}


//Login
async function validatelogin(params){
    let schema=joi.object({
        email:joi.string().min(5).max(55).required(),
        password:joi.string().min(3).max(20).required()
    })
    let log = schema.validate(params, { abortEarly: false });
    if (log.error) {
        let msg = []
        for (let err of log.error.details) {
            msg.push(err.message)
        }
        return { error: msg }
    }
    return { data: log.value }
}
async function userlogin(params) {
    let valid = await validatelogin(params).catch((err) => { return { error: err } })
    if (!valid || valid.error) {
        console.log(valid.error)
        return ({ error: valid.error })
    }
    let checkemail = await User.findOne({ where: { email: params.email } }).catch((err) => { return { error: err } })
    console.log(checkemail)
    if (!checkemail || checkemail.error) {
    
        return ({ error:"user not found" })
    }

    let checkpassword = await bcrypt.compare(params.password, checkemail.password).catch((err) => {return { error: err } })
    console.log(checkpassword)
    if (!checkpassword || checkpassword.error) {
        return ({ error: "incorrect password" })
    }

    let token = await encrypt({ id: checkemail.id }, "1234").catch((err) => { return { error: err } })
    if (token.error) {
        console.log(token.error);
        return { error: "internal server error" }
    }

    let result = await checkemail.save().catch((err) => { return { error: err } })
    if (result.error) {
        return { error: "internal server error" }
    }
    return { data: "login succesfully", token }
}


//forgetpassword

async function forgetpass(params) {
    let schema = joi.object({
        email: joi.string().min(5).max(55).required(),
    });
    let valid = await schema.validate(params, { abortEarly: false });
    if (valid.error) {
        let msg = []
        for (let err of valid.error.details) {
            msg.push(err.message)
        }
        return { error: msg }
    }
    return { data: valid.value }
}
async function userpassword(params) {
    let valid = await forgetpass(params).catch((err) => { return { error: err } })
    if (!valid || valid.error) {
        return { error: valid.error }
    }
    let user = await User.findOne({ where: { email: params.email } }).catch((err) => { return { error: err } })
    if (!user || user.error) {
        return ({ error: "user not found" })
    }
    let OTP = randomstring.generate(10)
    let pass = await User.update({ OTP: OTP }, { where: { id: user.id } }).catch((err) => { return { error: err } })
    console.log(pass)
    if (!pass || pass.error) {
        return { error: "Internal server error" }
    }

    let mailoption = {
        from: "libraryproject@gmail.com",
        to: user.email,
        subject: 'reset password mail',
        text: `for reseting your password used this otp ${OTP}`
    }
    let sendmail = await email(mailoption).catch((err) => {
        return { error: err }
    })
    if (!sendmail || sendmail.error) {
        return { error: "internal server error" }
    }
    return { data: sendmail }
}

//resetpassword
async function resetpass(params) {
    let schema = joi.object({
        OTP: joi.string().min(10).max(55).required(),
        Newpassword: joi.string().min(3).max(20).required()
    });
    let valid = await schema.validate(params, { abortEarly: false });
    if (valid.error) {
        let msg = []
        for (let err of valid.error.details) {
            msg.push(err.message)
        }
        return { error: msg }
    }
    return { data: valid.value }
}
async function resetpassword(params) {
    let valid = await resetpass(params).catch((err) => { return { error: err } })
    if (!valid || valid.error) {
        return { error: valid.error }
    }

    let user = await User.findOne({ where: { OTP: params.OTP } }).catch((err) => { return { error: err } })
    if (!user || user.error) {
        return ({ error: "OTP NOT FOUND" })
    }

//     user.password = await bcrypt.hash(params.Newpassword,10).catch((err)=>{
//         return({error:err})
//     })
//         user.OTP = " "

//     let result = await user.save().catch((err)=>{
//         return {error:err}
//     })
// if(result.error){
//     return{error:"internal servel error"}
//}
    
    let update = await User.update({ password: await bcrypt.hash(params.Newpassword, 10) }, { where: { id: user.id } }).catch((err) => { return { error: err } })
    console.log(update)
    if (!update || update.error) {
        return { error: "Internal server error" }
    }
    let emtyotp = await User.update({ OTP: " " }, { where: { id: user.id } }).catch((err) => { return { error: err } })
    if (!emtyotp || emtyotp.error) {
        return { error: "Internal server error" }
    }
    return { data: "password reset successful" }

}
//changepassword
async function changepass(params) {
    let schema = joi.object({
        Oldpassword: joi.string().min(3).max(20).required(),
        Newpassword: joi.string().min(3).max(20).required()
    });
    let valid = await schema.validate(params, { abortEarly: false });
    if (valid.error) {
        let msg = []
        for (let err of valid.error.details) {
            msg.push(err.message)
        }
        return { error: msg }
    }
    return { data: valid.value }
}
async function changepassword(params, userData) {
    let valid = await changepass(params).catch((err) => { return { error: err } })
    if (!valid || valid.error) {
        return { error: valid.error }
    }

    let user = await User.findOne({ where: { id: userData.id } }).catch((err) => { return { error: err } })
    console.log(user)
    if (!user || user.error) {
        return ({ error: "internal server error 1" })
    }

    let check = await bcrypt.compare(params.Oldpassword, user.password).catch((err) => { return { error: err } })
    if (!check || check.error) {
        return ({ error: "Invalid password!" })
    }

    let update = await User.update({ password: await bcrypt.hash(params.Newpassword, 10) }, { where: { id: user.id } }).catch((err) => { return { error: err } })
    if (!update || update.error) {
        return { error: "Internal server error 2" }
    }
    return { data: "change password successful" }
}




module.exports={userregister,userlogin,userpassword,resetpassword,changepassword}