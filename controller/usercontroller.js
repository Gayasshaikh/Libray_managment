
let {userregister,userlogin,userpassword,resetpassword,changepassword}=require("../model/usermodel")

//register
async function register(req,res){
    let check=await userregister(req.body).catch((err)=>{ return {error:err}})
    console.log(check)
    if(!check||check.error){
        return res.send({error:check.error})
    }
    return res.send({data:check})
}

//Login
async function login(req,res){
    let check=await userlogin(req.body).catch((err)=>{ return {error:err}})
    console.log(check)
    if(!check||check.error){
        return res.send({error:check.error})
    }
    return res.send({data:check})
}

//forgetpassword
async function forget(req, res) {
    let check = await userpassword(req.body).catch((error) => { return { error: error } })
    console.log(check.error)
    if (!check || check.error) {
        return res.send({ error: "internal serve error" })
    }
    return res.send({ data: check })
}

//resetpassword
async function reset(req, res) {
    let check = await resetpassword(req.body).catch((error) => { return { error: error } })
    console.log(check.error)
    if (!check || check.error) {
        return res.send({ error: "internal serve error" })
    }
    return res.send({ data: check })
}

//changepassword
async function change(req, res) {
    //console.log(req.userData)
    let check = await changepassword(req.body,req.userData).catch((error) => { return { error: error } })
    console.log(check)
    if (!check || check.error) {
        //console.log(userData)
        return res.send({ error:check.error })
    }
    return res.send({ data: check })
}



 module.exports={register,login,forget,reset,change}