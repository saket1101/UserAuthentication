const mongoose = require("mongoose")
const  validator= require("validator")
const bcrypt = require("bcrypt")
require("dotenv").config()
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [3, "plz enter a valid name"],
        max: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          }
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hash = await bcrypt.hash(this.password, 10)
        this.password = hash
    }
    next()
})

// userSchema.methods.genAuthToken = ()=> {
//     try {
//         console.log(this._id)
//         const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: "15h" })
//         console.log(token)
//         //return token
//     } catch (error) {
//         res.send(error)
//     }
// }

const User = mongoose.model("User", userSchema)

module.exports = User