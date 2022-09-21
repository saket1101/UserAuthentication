require("dotenv").config()
const nodemailer = require("nodemailer")
//const { userPassReset } = require("../controller/userController")
//const {sendEmailResetPass} = require("../controller/userController")

module.exports.sendmail = async function sendMail(str, data) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,

            }
        })
        var Osubject, Otext, Ohtml

        if (str == "signup") {
            Osubject = `Thank you for signing ${data.email}`
            Ohtml = `<h1> Welcome to myApp </h1>
    Name: ${data.name}
    Email: ${data.email}`

        } else if (str == "resetPasswordLink") {
            Osubject = "Here is your reset Password Link";
            Ohtml = `<a href= "${data.resetPasswordLink}>click on </a>the given link`
        }
        //console.log(data)
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: data.email.email,
            subject: Osubject,
            html: Ohtml

        })
    } catch (err) {
        console.log(err.message)
    }
}