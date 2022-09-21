const express = require("express")
const userRouter = express.Router()
const {registerUser,loginUser,changePassword ,sendEmailResetPass,userPassReset} = require("../controller/userController")
const authUser = require("../middlerware/authmiddleware")


userRouter.route("/register")
.post(registerUser)

userRouter.route("/login")
.post(loginUser)

userRouter.route("/resetPassLink")
.post(sendEmailResetPass)

userRouter.route("/passwordReset/:id/:token")
.post(userPassReset)

userRouter.use(authUser).route("/changePassword").post(changePassword)

module.exports = userRouter