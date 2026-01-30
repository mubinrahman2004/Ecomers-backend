const express=require("express")
const authMeddleware = require("../meddlewer/authMedlewere")
const roleCheckMiddleware = require("../meddlewer/roleCheckMiddleware")
const { creatProduct } = require("../controllers/productControllers")
const multer = require("multer")
const route=express.Router()
const upload=multer() 

route.post("/upload",authMeddleware,roleCheckMiddleware("admin","editor"),upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'image', maxCount: 4 }]),creatProduct)

module.exports=route