let express = require("express");
let App = express();
let {app } = require("./route")

App.use(app);

App.listen(3003, () => { console.log("connected to server") })