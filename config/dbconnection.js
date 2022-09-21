
const mongoose = require("mongoose")
const {isEmail} = require("validator")
require("dotenv").config()


mongoose.connect(process.env.DB_LINK)
.then(()=>{
    console.log("db is connected")
}).catch((error)=>{
    console.log("error",error)
})

