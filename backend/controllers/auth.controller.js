
import {user} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailTrap/nodemailerTrap.js";
import {sendWelcomeEmail,sendPasswordResetEmail} from "../mailTrap/emails.js";



export const signup = async (req, res) => {
    const { username, email, password } = req.body;
  try {
    if(!email || !password || !username) {
        throw new Error("All Field are required");
    }

    const userAlreadyExist = await user.findOne({username});
    if(userAlreadyExist){
       return res.status(400).json({success:false,message:"User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();

    const userData = new user({
        email,
        password:hashedPassword,
        username,
        verificationToken,
        verificationExpireAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await userData.save();


    // JWT token
   await generateTokenAndSetCookie(res,userData._id);
   const sendVerificationEmailoutput = await sendVerificationEmail(userData.email,verificationToken);
   console.log("sendVerificationEmailoutput ",sendVerificationEmailoutput);
    res.status(201).json({success:true,message:"User created Successfully",user:{...userData._doc,password:undefined}});
  } catch (error) {
    console.error("error",error);
    res.status(500).send({ message: "Error creating user" });
  }
};
// ------------------------------------------------------------------------
export const verifyEmail = async(req,res)=>{
  // 123456 : 6 digit
  const {code} = req.body;
  try{
    const userr = await user.findOne({verificationToken:code,verificationExpireAt: {$gt:Date.now()}});
    const userdata = await user.findOne({verificationToken:code});
    console.log(user);
    console.log(userdata);
    if(!userdata){
      return res.status(400).json({success:false,message:"Invalid verification code"})
    }
    userdata.isVerified = true;
    userdata.verificationToken=undefined;
    userdata.verificationExpireAt=undefined;
    await userdata.save();
    await sendWelcomeEmail(userdata.email,userdata.name);
    res.status(200).json({success:true,message:"Email verified successfully",user:{...userdata._doc, password:undefined}});
  }catch(err){
    console.error(err);
    res.status(500).send({ message: "Error verify Email" });
  }
}
// ------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const {email,password}= req.body;
    const userdata = await user.findOne({email});
    if(!userdata){
      return res.status(400).json({success:false,message:"Invalid email or password"})
    }
    const isValidPassword = await bcrypt.compare(password,userdata.password);
    if(!isValidPassword){
      return res.status(400).json({success:false,message:"Invalid email or password"})
    }
    generateTokenAndSetCookie(res,userdata._id);
    userdata.lastLogin = new Date();
    await userdata.save();
    res.status(200).json({success:true,message:"Logged in successfully",user:{...userdata._doc,password:undefined,},});
  } catch (error) {
    console.error("Erro in login function : " ,error);
    res.status(400).send({ message: "Error creating user" });
  }
};
// ----------------
// --------------------------------------------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");  //Save cookie in generateTokenAndSetCookie
    res.status(200).json({success:true,message:"Logged out successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating user" });
  }
};
// --------------------------------------
export const forgotPassword = async (req,res) =>{
  try{
    const {email} = req.body;
    console.log("forgotPassword:backend",email);
    const userdata = await user.findOne({email});
    console.log("userdata",userdata);
    if(!userdata){
      return res.status(400).json({success:false,message:"Email not found"})
      }
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;
      console.log("forgotPassword:resetToke",resetToken);
      userdata.resetPasswordToken = resetToken;
      userdata.resetPasswordExpireAt = resetTokenExpireAt;
      await userdata.save();
      console.log("userdata :",userdata, " email : ",email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
      // send email
      await sendPasswordResetEmail(userdata.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)
      res.status(200).json({success:true,message:"Password reset link sent to your email"});
    }catch(err){
      console.error("Error from forgot password " ,err);
      res.status(400).json({ success:false,message: err.message });
    }
}

export const resetPassword = async(req,res) =>{
  console.log("resetPassword",req.body)
  try{
    const {token} = req.params;
    const {password} = req.body;
      console.log("resetPassword",token,password)
    const userdata = await user.findOne({resetPasswordToken:token, resetPasswordExpireAt: {$gt: Date.now()}});
    console.log("userdata ",userdata);
    if(!userdata){
      return res.status(400).json({success:false,message:"Invalid token or expired token"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    userdata.password = hashedPassword;
    userdata.resetPasswordToken = undefined;
    userdata.resetPasswordExpireAt = undefined;

    await userdata.save();
    await sendPasswordResetEmail(userdata.email);
    // send email
    console.log("userdata :",userdata, " email : ",userdata.email,"password reset successfully")
   return res.status(200).json({success:true,message:"password reset successful"});
  }catch(err){
    console.error("Error from reset password " ,err);
    res.status(400).json({ success:false,message: err.message });
  }

}

export const checkAuth = async(req,res)=>{
  try{
    const userdata = await user.findById(req.userId).select("-password");
    console.log("userdata",userdata);
    console.log("req.userId",req.userId);
    if(!userdata){
      return res.status(400).json({success:false,message:"User not found"});
    }
    res.status(200).json({success:true,userdata});
  }catch(err){
    console.log("Error in checkAuth ",err);
    res.status(400).json({success:false,message:err.message});
  }
}