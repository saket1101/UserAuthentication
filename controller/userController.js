const express = require("express")
const User = require("../models/userModel")
const userRouter = require("../routers/userRouter")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { findOne } = require("../models/userModel")
const { sendmail } = require("../config/emailConfig")
//const nodemailer = require("nodemailer")


module.exports.registerUser = async (req, res) => {
    try {
        const email = req.body.email
        //console.log(email)
        const user = await User.findOne({ email })
        //console.log(user)
        if (!user) {
            const users = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            const registerd = await users.save()
            //console.log(registerd)
            const token = jwt.sign({ userId: users._id }, process.env.SECRET_KEY, { expiresIn: "4d" })
            //console.log(token)
            res.json({
                msg: "User Successfully registerd",
                user: registerd.name,
                token: token
            })
        } else {
            res.send("User already found plz login!")
        }

    } catch (error) {
        res.json({
            msg: "msg",
            error: error.message

        })
    }

}
// login User

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        //console.log(user)
        const isMatch = await bcrypt.compare(password, user.password)
        if (user) {
            if (isMatch) {
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "15d" })
                res.json({
                    msg: "User logged in successfully",
                    token: token
                })
            } else {
                res.send("Invalid Login")
            }

        } else {
            res.send("User not found")
        }

    } catch (err) {
        res.json({
            msg: "Login problem",
            error: err.message
        })
    }
}
// password change
module.exports.changePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                res.send("Invalid ")
            } else {
                const newHashedPass = await bcrypt.hash(password, 10)
                const updatedPassword = await User.findByIdAndUpdate(req.user._id, { $set: { password: newHashedPass } })

                res.send("password changed successfully")
            }
        } else {
            res.send("password required")
        }

    } catch (error) {
        res.send(error.message)
    }
}

// sent emial for reset password

module.exports.sendEmailResetPass = async (req, res) => {
    try {
        const email = req.body
        //console.log(email)
        if (email) {
            const user = await User.findOne(email)
            //console.log(user)
            if (user) {
                const secret = user._id + process.env.SECRET_KEY
                const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "15m" })
                const link = `http://127.0.0.1:3000/resetPassword/${user._id}/${token}`
                let obj = {
                    resetPasswordLink: link,
                    email: email
                }
                //console.log(obj)
                sendmail("resetPasswordLink", obj)
                res.send({ "status": "success", "message": "reset password link send on your email" })

            } else {
                res.send("user not found")
            }

        } else {
            res.send("Plz input your email")
        }
    } catch (error) {
        res.json({
            msg: "resetPassLink",
            err: error.message

        })
    }
}
// reset pasword save
module.exports.userPassReset = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body
        const { id, token } = req.params
        if (password && confirmPassword) {
            if (password === confirmPassword) {
                const user = await User.findById(id)
                if (user) {

                    const new_secret = user._id + process.env.SECRET_KEY

                    jwt.verify(token, new_secret)

                    const newHashPass = await bcrypt.hash(password, 10)

                    const resetPass = await User.findByIdAndUpdate(user._id, { $set: { password: newHashPass } })

                    res.send("Password reset successfully")
                } else {
                    res.send("usr not found")
                }


            } else {
                res.send("password and confirmPassword does not match")
            }

        } else {
            res.send("Invalid! Both field required")
        }

    } catch (err) {
        res.send(err)
    }
}