const express = require("express")
const dbconnection = require("./config/dbconnection")
const userRouter = require("./routers/userRouter")
require("dotenv").config()
const port = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/account", userRouter)

app.get("/", (req,res)=>{
    res.send("hi you are on port")
})

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})