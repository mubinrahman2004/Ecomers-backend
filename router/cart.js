 const express =require("express")
const addToCart = require("../controllers/CartControllers")

 const route =express.Router()
route.post("/add",addToCart)

 
 module.exports=route