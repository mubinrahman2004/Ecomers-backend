  const express =require("express")
const { signupUser, verifyOtp, resendOTP, signInUser } = require("../controllers/authController")
  const route =express.Router()
 
 route.post("/signup",signupUser),
 route.post("/verifyOtp",verifyOtp)
 route.post("/resendOTP",resendOTP)
 route.post("/signInUser",signInUser)
  module.exports=route  