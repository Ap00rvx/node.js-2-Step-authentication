const User= require("../model/user_model");
const jwt = require("jsonwebtoken");
const isEmailVerified = async (req,res,next) => {
    const token = req.header("x-auth-token");
    if (!token)return res.send({"message":"No token found"}); 
    else{
        try {
            const userId = jwt.verify(token, process.env.SECRET_KEY);
            const user  = await User.findById(userId['userID']).select('-password');
            req.user = user; 
            const isVerified = user.isVerified ; 
            if(isVerified){
                next(); 
            } 
            else {
                res.send({"message":"Please Verify your email !!"}); 
            }
        }catch(err){
            console.log(err);
            res.status(500).send({"message":"Internal Server error"}); 
        }
    }
}

module.exports = isEmailVerified;