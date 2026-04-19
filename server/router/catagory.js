 const express =require("express")
 const multer  = require('multer')
const authMeddleware = require("../meddlewer/authMedlewere")
const { createNewCatagory, getAllCategories } = require("../controllers/categoryControler")
const roleCheckMiddleware = require("../meddlewer/roleCheckMiddleware")
 const upload = multer()
 const route =express.Router()


 
 route.post("/create",authMeddleware,roleCheckMiddleware("admin"),upload.single("thumbnail"), createNewCatagory)
route.get("/all",getAllCategories)
 module.exports=route