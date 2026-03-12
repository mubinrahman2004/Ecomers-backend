 const express =require("express")
const { addToCart, getUserCart, updateCart } = require("../controllers/CartControllers")

 const route =express.Router()
route.post("/add",addToCart)
route.get("/get",getUserCart)  
route.put("/update",updateCart)

 
 module.exports=route