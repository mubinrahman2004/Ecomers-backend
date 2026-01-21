  const express =require("express")
const { signupUser, verifyOtp, resendOTP, signInUser, forgetPass, resetPassword, getUserProfile, updateUserProfile } = require("../controllers/authController")
const authMeddleware = require("../meddlewer/authMedlewere")
const multer  = require('multer')
const upload = multer()
  const route =express.Router()
 
 route.post("/signup",signupUser),
 route.post("/verifyOtp",verifyOtp)
 route.post("/resendOTP",resendOTP)
 route.post("/signin" ,signInUser)
 route.post("/forgetpassword" ,forgetPass)
 route.post("/resetpass/:token" ,resetPassword)
 route.get("/Profile" ,authMeddleware, getUserProfile)
 route.put("/Profile" ,authMeddleware,upload.single('avatar'), updateUserProfile)

  module.exports=route    