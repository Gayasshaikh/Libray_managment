let express=require("express")
let app=express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let {Auth}=require("./middleware/auth")

let {register,login,forget,reset,change}=require("./controller/usercontroller")

//user register
app.post("/api/user/register",register)
//Login
app.get("/api/user/login",login)
//forgetpassword
app.put("/api/user/forgetpassword",forget)
//restepassword
app.post("/api/user/resetpassword",reset)
//changepassword
app.post("/api/user/changepassword",Auth("user"),change)


module.exports={app}