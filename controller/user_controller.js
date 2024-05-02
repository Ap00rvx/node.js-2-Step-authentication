const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const User = require("../model/user_model"); 
const sendMail = require('../helper/mail_services');
const OTP = require('../model/otp_model');
const otpGenerator = require('otp-generator')


class UserController{
    static  register = async(req,res) =>{
            const {username,email,password}  = req.body ;
            if(username && email && password){
                const existingUser = await User.findOne({email :email}); 
                if(existingUser){
                    res.send({"messsage":"Email Already exist, try using another email"});
                }
                else{
                    const salt = await bcrypt.genSalt(10); 
                    const hashpassword = await bcrypt.hash(password,salt);
                    const newUser  = new User({
                      username:username,
                      email:email,
                      password:hashpassword,
                    }); 
                    await newUser.save(); 
                    const saved_user =await User.findOne({email:email});
                    const token = jwt.sign({userID:saved_user._id},process.env.SECRET_KEY,{expiresIn : '150d'});
                
                    const newOtp  = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                    const otpmodel = new OTP({
                        email:email,
                        otp:newOtp,
                    });
                    await otpmodel.save(); 
                    await sendMail(email,newOtp);           
                    res.status(201).send({"status":"success", "message":"User created successfully","token":token});   
                }
            }
            else{
                res.send({"message":"Failed, All fields are required"}); 
            }
    }
    static home = async(req,res) => {
        const user = req.user;
        res.send({"message":user});     
     }
     static verifyOTP = async (req, res) => {
        const { email, otp } = req.body;
        // Validate request body
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required fields" });
        }
    
        try {
            const otpModel = await OTP.findOneAndDelete({ email: email });
            if (!otpModel) {
                return res.status(404).json({ message: "OTP not found or expired" });
            }
    
            if (otp === otpModel.otp) {
                const user = await User.findOneAndUpdate({ email: email }, { isVerified: true });
                return res.status(200).json({ message: "OTP Verified" });
            } else {
                return res.status(400).json({ message: "Invalid OTP" });
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
    

}

module.exports = UserController ;