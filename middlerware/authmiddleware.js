const User = require("../models/userModel")
const jwt = require("jsonwebtoken")


const authUser = async ( req,res,next) =>{
  try{  const {authorization} = req.headers
  
    if(authorization && authorization.startsWith("Bearer")){
        // get token from header
        const token = authorization.split(" ")[1]
       // TOKEN VERIFY
       const {userId} = jwt.verify(token, process.env.SECRET_KEY);
       // Get User from id 
       req.user =  await User.findById(userId).select("-password") 
      
      next()

    }else{
        res.send ("User not Authorized")
 
    }
}catch(error){
    res.send(error.message)
}
}

module.exports = authUser