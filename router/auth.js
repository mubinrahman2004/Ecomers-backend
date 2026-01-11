  const express =require("express")
const { signupUser, verifyOtp, resendOTP, signInUser, forgetPass } = require("../controllers/authController")

  const route =express.Router()
 
 route.post("/signup",signupUser),
 route.post("/verifyOtp",verifyOtp)
 route.post("/resendOTP",resendOTP)
 route.post("/signin" ,signInUser)
 route.post("/forgetpassword" ,forgetPass)

  module.exports=route   